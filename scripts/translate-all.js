const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const AZURE_TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
const AZURE_TRANSLATOR_REGION = process.env.AZURE_TRANSLATOR_REGION;

if (!AZURE_TRANSLATOR_KEY) {
  console.error("❌ AZURE_TRANSLATOR_KEY is missing in .env.local");
  process.exit(1);
}

// The 35 supported languages
const TARGET_LANGS = [
  'en', 'es', 'fr', 'de', 'pt', 'ru', 'zh-CN', 'zh-TW', 'ja', 'ko',
  'ar', 'hi', 'bn', 'id', 'tr', 'vi', 'it', 'pl', 'th', 'tl',
  'nl', 'sv', 'no', 'da', 'fi', 'cs', 'el', 'ro', 'hu', 'uk',
  'he', 'ms', 'ta', 'te', 'ur'
];

// ─────────────────────────────────────────────────────────────────────────────
// ALL MODULES TO TRANSLATE
// Format: { name, type: 'flat' | 'dir', localesDir, enFile, lowercase: boolean }
// flat  → locales/en.json, locales/es.json, etc.
// dir   → locales/en/translation.json, locales/es/translation.json, etc.
// ─────────────────────────────────────────────────────────────────────────────
const MODULES = [
  {
    name: 'coaching_integration',
    type: 'flat',
    localesDir: 'src/app/coaching_integration/_src/locales',
    enFile: 'en.json',
  },
  {
    name: 'coaching_areas',
    type: 'flat',
    localesDir: 'src/app/coaching_areas/_src/i18n/locales',
  },
  {
    name: 'goal_momentum',
    type: 'flat',
    localesDir: 'src/app/goal_momentum/_src/i18n/locales',
  },
  {
    name: 'confidence_identity',
    type: 'flat',
    localesDir: 'src/app/confidence_identity/_src/locales',
    enFile: 'en.json',
    lowercase: true,
  },
  {
    name: 'daily_focus',
    type: 'flat',
    localesDir: 'src/app/daily_focus/_src/locales',
    enFile: 'en.json',
  },
  {
    name: 'coach_journey',
    type: 'dir',
    localesDir: 'public/coach_journey/locales',
  },
  {
    name: 'emotional_regulation',
    type: 'dir',
    localesDir: 'public/emotional_regulation/locales',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE CODE MAPPING (Azure uses different codes for some languages)
// ─────────────────────────────────────────────────────────────────────────────
function toAzureLang(code) {
  const map = {
    'zh-CN': 'zh-Hans',
    'zh-cn': 'zh-Hans',
    'zh-TW': 'zh-Hant',
    'zh-tw': 'zh-Hant',
    'tl': 'fil',
  };
  return map[code] || code;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEEP DIFF: find keys present in source but missing/empty in target
// ─────────────────────────────────────────────────────────────────────────────
function getMissingKeys(source, target, currentPath = []) {
  let missing = [];
  for (const key in source) {
    const newPath = [...currentPath, key];
    const srcVal = source[key];
    const tgtVal = target ? target[key] : undefined;

    if (typeof srcVal === 'string') {
      if (!tgtVal || tgtVal.trim() === '') {
        missing.push(newPath);
      }
    } else if (Array.isArray(srcVal)) {
      srcVal.forEach((item, index) => {
        const tgtItem = tgtVal && tgtVal[index];
        if (typeof item === 'string') {
          if (!tgtItem || tgtItem.trim() === '') {
            missing.push([...newPath, String(index)]);
          }
        } else if (typeof item === 'object' && item !== null) {
          missing = missing.concat(getMissingKeys(item, tgtItem || {}, [...newPath, String(index)]));
        }
      });
    } else if (typeof srcVal === 'object' && srcVal !== null) {
      missing = missing.concat(getMissingKeys(srcVal, tgtVal || {}, newPath));
    }
  }
  return missing;
}

function getValue(obj, pathArr) {
  return pathArr.reduce((cur, k) => (cur != null ? cur[k] : undefined), obj);
}

function setValue(obj, pathArr, value) {
  let cur = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const k = pathArr[i];
    const nextIsArr = !isNaN(pathArr[i + 1]);
    if (cur[k] == null) cur[k] = nextIsArr ? [] : {};
    cur = cur[k];
  }
  cur[pathArr[pathArr.length - 1]] = value;
}

// ─────────────────────────────────────────────────────────────────────────────
// AZURE BATCH TRANSLATE
// ─────────────────────────────────────────────────────────────────────────────
async function translateBatch(texts, targetLang) {
  const azureLang = toAzureLang(targetLang);
  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${azureLang}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
      'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(texts.map(t => ({ text: t }))),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure API Error (${response.status}) for lang=${azureLang}: ${err}`);
  }

  const data = await response.json();
  return data.map(res => res.translations[0].text);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS A SINGLE LOCALE FILE (flat format)
// ─────────────────────────────────────────────────────────────────────────────
async function processFlatFile(enContent, filePath, langCode) {
  let target = {};
  if (fs.existsSync(filePath)) {
    try { target = JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
    catch (e) { console.warn(`  ⚠️  Could not parse ${path.basename(filePath)}, will rebuild.`); }
  }

  const missing = getMissingKeys(enContent, target);
  if (missing.length === 0) {
    console.log(`  ✅ ${langCode} — already complete`);
    return;
  }

  console.log(`  🌐 ${langCode} — ${missing.length} missing keys`);

  const BATCH = 25;
  let done = 0;
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const texts = batch.map(p => getValue(enContent, p));
    try {
      const translated = await translateBatch(texts, langCode);
      batch.forEach((p, j) => setValue(target, p, translated[j]));
      done += batch.length;
      fs.writeFileSync(filePath, JSON.stringify(target, null, 2), 'utf-8');
      process.stdout.write(`\r     Progress: ${done}/${missing.length}         `);
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error(`\n  ❌ ${langCode} batch failed: ${e.message}`);
      break;
    }
  }
  console.log(`\n  🎉 ${langCode} — done (${done} keys translated)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS FLAT MODULE  (locales/en.json, locales/es.json …)
// ─────────────────────────────────────────────────────────────────────────────
async function processFlatModule(mod) {
  const dir = path.resolve(process.cwd(), mod.localesDir);
  const enFile = path.join(dir, mod.enFile || 'en.json');

  if (!fs.existsSync(enFile)) {
    console.warn(`  ⚠️  en.json not found in ${mod.localesDir}, skipping.`);
    return;
  }

  // Ensure locales dir exists
  fs.mkdirSync(dir, { recursive: true });

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));

  for (const lang of TARGET_LANGS) {
    if (lang === 'en') continue;
    const langFilename = mod.lowercase ? lang.toLowerCase() : lang;
    const filePath = path.join(dir, `${langFilename}.json`);
    await processFlatFile(enContent, filePath, langFilename);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCESS DIR MODULE  (locales/en/translation.json, locales/es/translation.json …)
// ─────────────────────────────────────────────────────────────────────────────
async function processDirModule(mod) {
  const dir = path.resolve(process.cwd(), mod.localesDir);
  const enFile = path.join(dir, 'en', 'translation.json');

  if (!fs.existsSync(enFile)) {
    console.warn(`  ⚠️  en/translation.json not found in ${mod.localesDir}, skipping.`);
    return;
  }

  // Ensure locales dir exists
  fs.mkdirSync(dir, { recursive: true });

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));

  for (const lang of TARGET_LANGS) {
    if (lang === 'en') continue;
    const langDirName = mod.lowercase ? lang.toLowerCase() : lang;
    const langDir = path.join(dir, langDirName);
    const filePath = path.join(langDir, 'translation.json');
    
    // Ensure directory exists
    fs.mkdirSync(langDir, { recursive: true });
    await processFlatFile(enContent, filePath, langDirName);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  for (const mod of MODULES) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📦 Module: ${mod.name}  [${mod.localesDir}]`);
    console.log(`${'═'.repeat(60)}`);
    if (mod.type === 'flat') {
      await processFlatModule(mod);
    } else {
      await processDirModule(mod);
    }
  }
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🚀 ALL MODULES COMPLETE!`);
  console.log(`${'═'.repeat(60)}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
