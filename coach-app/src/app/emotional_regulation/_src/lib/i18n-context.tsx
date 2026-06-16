import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { EN_STRINGS } from "./i18n-strings";

// List of languages
const GENERATED_LANGS = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'zh', name: '简体中文' },
  { code: 'ja', name: '日本語' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ko', name: '한국어' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'th', name: 'ไทย' },
  { code: 'tl', name: 'Filipino / Tagalog' }
];

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: EN_STRINGS }
      },
      fallbackLng: "en",
      defaultNS: "translation",
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ["querystring", "localStorage", "navigator"],
        lookupQuerystring: "lang",
        caches: ["localStorage"]
      }
    });
} else {
  // If initialized by another module, ensure our strings are merged in
  i18n.addResourceBundle("en", "translation", EN_STRINGS, true, true);
}

const loadedLangs = new Set(["en"]);

async function loadLanguage(lang: string) {
  if (loadedLangs.has(lang)) return;
  try {
    const response = await fetch(`/coach/emotional_regulation/locales/${lang}/translation.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
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
  const [lang, setLangState] = useState(i18nInstance.language?.split('-')[0] || "en");
  const [translating, setTranslating] = useState(false);

  // Sync state with i18n instance
  useEffect(() => {
    const handleLangChange = async () => {
      const fullLang = i18nInstance.language || "en";
      const shortLang = fullLang.split('-')[0];
      
      if (shortLang !== "en" && !loadedLangs.has(shortLang)) {
        setTranslating(true);
        await loadLanguage(shortLang);
        setTranslating(false);
      }
      setLangState(shortLang);
    };
    handleLangChange();
  }, [i18nInstance.language]);

  const setLang = useCallback((newLang: string) => {
    i18nInstance.changeLanguage(newLang);
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
