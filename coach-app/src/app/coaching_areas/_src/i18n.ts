import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Create a mapping of languages to their names for the UI
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "bn", name: "বাংলা" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "tr", name: "Türkçe" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "it", name: "Italiano" },
  { code: "pl", name: "Polski" },
  { code: "th", name: "ไทย" },
  { code: "tl", name: "Filipino / Tagalog" },
  { code: "nl", name: "Nederlands" },
  { code: "sv", name: "Svenska" },
  { code: "no", name: "Norsk" },
  { code: "da", name: "Dansk" },
  { code: "fi", name: "Suomi" },
  { code: "cs", name: "Čeština" },
  { code: "el", name: "Ελληνικά" },
  { code: "ro", name: "Română" },
  { code: "hu", name: "Magyar" },
  { code: "uk", name: "Українська" },
  { code: "he", name: "עברית" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "ur", name: "اردو" }
];

// Initially, we only import English. The other languages will be loaded dynamically or added once generated.
// To keep the bundle manageable, we'll try to load these as needed, but for now we'll import English as fallback.
import enTranslation from "./i18n/locales/en.json";

const isBrowser = typeof window !== 'undefined';

const i18nInstance = i18n.use(initReactI18next);

if (isBrowser) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance.init({
  resources: {
    en: { translation: enTranslation },
  },
  fallbackLng: "en",
  detection: {
    order: ["querystring", "localStorage", "navigator"],
    lookupQuerystring: "lang",
    caches: isBrowser ? ["localStorage"] : [],
  },
  interpolation: {
    escapeValue: false,
  },
});

// Add a resource bundle and switch to it
export const addResourceBundle = (lng: string, resources: any) => {
  if (!i18n.hasResourceBundle(lng, "translation")) {
    i18n.addResourceBundle(lng, "translation", resources, true, true);
  }
};

// Initial load for detected language
const getShortLng = (lng: string) => {
  if (!lng) return 'en';
  const low = lng.toLowerCase();
  if (low.startsWith('zh-tw') || low.startsWith('zh-hk') || low.startsWith('zh-hant')) return 'zh-TW';
  if (low.startsWith('zh')) return 'zh-CN';
  return lng.split('-')[0];
};
const initialLng = getShortLng(i18n.language);

if (isBrowser && initialLng && initialLng !== 'en') {
  import(`./i18n/locales/${initialLng}.json`)
    .then(translation => {
      addResourceBundle(initialLng, translation.default);
      i18n.changeLanguage(initialLng);
    })
    .catch(err => console.error("Initial lang load failed", err));
}

i18n.on('languageChanged', (lng) => {
  if (isBrowser) {
    document.documentElement.lang = lng;
    document.documentElement.dir = i18n.dir(lng);
  }
});

export default i18n;
