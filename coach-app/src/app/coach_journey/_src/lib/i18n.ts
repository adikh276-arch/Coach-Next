import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'pt', 'de', 'ar', 'hi', 'bn', 'zh-CN', 'ja', 'id', 'tr', 'vi', 'ko', 'ru', 'it', 'pl', 'th', 'tl'],
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/coach/coach_journey/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lang', // As requested: /?lang=FR
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;

