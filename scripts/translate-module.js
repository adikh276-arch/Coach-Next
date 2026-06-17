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

const args = process.argv.slice(2);
const localesDir = args.find(arg => arg.startsWith('--localesDir='))?.split('=')[1];

if (!localesDir) {
  console.error("❌ Please provide --localesDir. Example: npm run translate -- --localesDir=src/app/coaching_areas/_src/i18n/locales");
  process.exit(1);
}

const absoluteLocalesDir = path.resolve(process.cwd(), localesDir);
if (!fs.existsSync(absoluteLocalesDir)) {
  console.error(`❌ Directory not found: ${absoluteLocalesDir}`);
  process.exit(1);
}

// Ensure en.json exists
const enFilePath = path.join(absoluteLocalesDir, 'en.json');
if (!fs.existsSync(enFilePath)) {
  console.error(`❌ en.json not found in ${absoluteLocalesDir}. English must be the base language.`);
  process.exit(1);
}

const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf-8'));

// Helper: Deeply find missing/empty keys in target compared to source
// Returns an array of paths that are missing in the target.
function getMissingKeys(source, target, currentPath = []) {
  let missing = [];
  for (const key in source) {
    const newPath = [...currentPath, key];
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      if (typeof target[key] !== 'object' || target[key] === null) {
        // If target is missing the entire object, we still traverse source to get individual string keys
        missing = missing.concat(getMissingKeys(source[key], {}, newPath));
      } else {
        missing = missing.concat(getMissingKeys(source[key], target[key], newPath));
      }
    } else if (typeof source[key] === 'string') {
      if (!target || !target[key] || target[key].trim() === '') {
        missing.push(newPath);
      }
    } else if (Array.isArray(source[key])) {
       if (!target || !Array.isArray(target[key]) || target[key].length !== source[key].length) {
         // Arrays are tricky, typically we don't have arrays in i18next but coaching_areas does!
         // If lengths mismatch or it's missing, we translate the whole array item by item.
         source[key].forEach((item, index) => {
            if (typeof item === 'string') {
               if (!target || !target[key] || !target[key][index] || target[key][index].trim() === '') {
                  missing.push([...newPath, String(index)]);
               }
            } else if (typeof item === 'object') {
               const targetItem = (target && target[key] && target[key][index]) ? target[key][index] : {};
               missing = missing.concat(getMissingKeys(item, targetItem, [...newPath, String(index)]));
            }
         });
       } else {
           // Both are arrays of same length
           source[key].forEach((item, index) => {
            if (typeof item === 'string') {
               if (!target[key][index] || target[key][index].trim() === '') {
                  missing.push([...newPath, String(index)]);
               }
            } else if (typeof item === 'object') {
               missing = missing.concat(getMissingKeys(item, target[key][index], [...newPath, String(index)]));
            }
         });
       }
    }
  }
  return missing;
}

// Helper: set value deeply
function setValue(obj, pathArr, value) {
  let current = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const p = pathArr[i];
    const isNextArray = !isNaN(pathArr[i + 1]);
    if (!current[p]) {
      current[p] = isNextArray ? [] : {};
    }
    current = current[p];
  }
  current[pathArr[pathArr.length - 1]] = value;
}

// Helper: get value deeply
function getValue(obj, pathArr) {
  let current = obj;
  for (let i = 0; i < pathArr.length; i++) {
    if (current === undefined || current === null) return undefined;
    current = current[pathArr[i]];
  }
  return current;
}

async function translateBatch(texts, targetLang) {
  // Azure language codes sometimes differ (e.g. zh-CN vs zh-Hans)
  let azureLang = targetLang;
  if (targetLang === 'zh-CN') azureLang = 'zh-Hans';
  if (targetLang === 'tl') azureLang = 'fil';
  
  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${azureLang}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
      'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(texts.map(t => ({ text: t })))
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure API Error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.map(res => res.translations[0].text);
}

async function processFile(filename) {
  if (filename === 'en.json' || !filename.endsWith('.json')) return;

  const targetLang = filename.replace('.json', '');
  const filePath = path.join(absoluteLocalesDir, filename);
  
  let targetContent = {};
  if (fs.existsSync(filePath)) {
    try {
      targetContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.warn(`⚠️ Could not parse ${filename}, starting fresh.`);
    }
  }

  console.log(`\n🔍 Analyzing ${filename}...`);
  const missingKeysPath = getMissingKeys(enContent, targetContent);
  
  if (missingKeysPath.length === 0) {
    console.log(`✅ ${filename} is already fully translated.`);
    return;
  }

  console.log(`🌐 Found ${missingKeysPath.length} missing text fragments in ${targetLang}. Translating...`);

  const BATCH_SIZE = 25; // Azure max limit is higher, but 25 is safe for large strings
  let totalTranslated = 0;

  for (let i = 0; i < missingKeysPath.length; i += BATCH_SIZE) {
    const batchPaths = missingKeysPath.slice(i, i + BATCH_SIZE);
    const batchTexts = batchPaths.map(p => getValue(enContent, p));
    
    try {
      const translatedTexts = await translateBatch(batchTexts, targetLang);
      
      // Map back to JSON object
      for (let j = 0; j < batchPaths.length; j++) {
        setValue(targetContent, batchPaths[j], translatedTexts[j]);
      }
      
      totalTranslated += batchPaths.length;
      console.log(`   Progress: ${totalTranslated} / ${missingKeysPath.length}`);
      
      // Save frequently to avoid losing progress
      fs.writeFileSync(filePath, JSON.stringify(targetContent, null, 2), 'utf-8');
      
      // Small sleep to respect rate limits
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`❌ Error translating batch in ${filename}:`, e.message);
      console.error("Aborting this file to prevent corruption.");
      break;
    }
  }

  console.log(`🎉 Finished ${filename}. Successfully translated ${totalTranslated} new keys.`);
}

async function main() {
  const files = fs.readdirSync(absoluteLocalesDir);
  console.log(`Found ${files.length} files in locales directory.`);
  
  for (const file of files) {
    await processFile(file);
  }
  
  console.log("\n🚀 All done!");
}

main().catch(console.error);
