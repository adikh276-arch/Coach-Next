import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { EN_STRINGS } from "@/lib/i18n-strings";

// List of 35 generated languages
const GENERATED_LANGS = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'th', name: 'ไทย' },
  { code: 'tl', name: 'Filipino / Tagalog' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'no', name: 'Norsk' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'cs', name: 'Čeština' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'ro', name: 'Română' },
  { code: 'hu', name: 'Magyar' },
  { code: 'uk', name: 'Українська' },
  { code: 'he', name: 'עברית' },
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ur', name: 'اردو' }
];

// Helper to normalize language code
function getNormLangCode(rawLang?: string) {
  if (!rawLang) return "en";
  const low = rawLang.toLowerCase();
  if (low.startsWith("zh-tw") || low.startsWith("zh-hk") || low.startsWith("zh-hant")) return "zh-TW";
  if (low.startsWith("zh")) return "zh-CN";
  return low.split("-")[0];
}

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: EN_STRINGS }
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      caches: ["localStorage"]
    }
  });

// Load other languages dynamically from public/locales
const loadedLangs = new Set(["en"]);

async function loadLanguage(lang: string) {
  if (loadedLangs.has(lang)) return;
  try {
    const response = await fetch(`/locales/${lang}/translation.json`);
    const translations = await response.json();
    i18n.addResourceBundle(lang, "translation", translations, true, true);
    loadedLangs.add(lang);
  } catch (error) {
    console.error(`Failed to load translation for ${lang}:`, error);
  }
}

interface I18nContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  languages: { code: string; name: string }[];
  translating: boolean;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
  languages: GENERATED_LANGS,
  translating: false,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [lang, setLangState] = useState(getNormLangCode(i18nInstance.language));
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const handleLangChange = async () => {
      const currentLang = getNormLangCode(i18nInstance.language);
      if (currentLang !== "en") {
        setTranslating(true);
        await loadLanguage(currentLang);
        setTranslating(false);
      }
      setLangState(currentLang);
    };
    handleLangChange();
  }, [i18nInstance.language]);

  const setLang = useCallback((newLang: string) => {
    i18nInstance.changeLanguage(newLang);
    // URL update is handled by LanguageDetector (querystring) if we change it here
    const url = new URL(window.location.href);
    url.searchParams.set("lang", newLang);
    window.history.replaceState({}, "", url.toString());
  }, [i18nInstance]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, languages: GENERATED_LANGS, translating }}>
      {children}
    </I18nContext.Provider>
  );
};
