import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import enStrings from "@/locales/en.json";

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  lang: string;
  setLang: (lang: string) => void;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key) => (enStrings as any)[key] || key,
  lang: "en",
  setLang: () => {},
  isLoading: false,
});

export const useTranslation = () => useContext(TranslationContext);

const SUPPORTED_LANGS = [
  "en", "es", "fr", "pt", "de", "ar", "hi", "bn", "zh-cn", "ja", "id", "tr", "vi", "ko", "ru", "it", "pl", "th", "tl"
];

const STORAGE_KEY = "user_language";

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang")?.toLowerCase();
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;
    
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && SUPPORTED_LANGS.includes(savedLang)) return savedLang;
    
    return "en";
  });

  const [translations, setTranslations] = useState<Record<string, string>>(enStrings);
  const [isLoading, setIsLoading] = useState(false);

  const setLang = useCallback((newLang: string) => {
    const normalizedLang = newLang.toLowerCase();
    if (!SUPPORTED_LANGS.includes(normalizedLang)) return;
    
    setLangState(normalizedLang);
    localStorage.setItem(STORAGE_KEY, normalizedLang);
    
    const url = new URL(window.location.href);
    if (normalizedLang === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", normalizedLang.toUpperCase());
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => {
    if (lang === "en") {
      setTranslations(enStrings);
      return;
    }

    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        // Vite will bundle these as separate JSON files and load them on demand
        const module = await import(`@/locales/${lang}.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${lang}:`, error);
        setTranslations(enStrings);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [lang]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    let str = translations[key] || (enStrings as any)[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  }, [translations]);

  return (
    <TranslationContext.Provider value={{ t, lang, setLang, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}
