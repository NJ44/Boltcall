import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';

// Lazy-load non-English locales on demand (only used in dashboard)
const loadLocale = async (lang: string) => {
  switch (lang) {
    case 'he':
      return (await import('./locales/he.json')).default;
    case 'es':
      return (await import('./locales/es.json')).default;
    default:
      return en;
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Load non-English locale if detected/stored
const detectedLang = i18n.language?.split('-')[0];
if (detectedLang && detectedLang !== 'en') {
  loadLocale(detectedLang).then((translations) => {
    i18n.addResourceBundle(detectedLang, 'translation', translations);
    i18n.changeLanguage(detectedLang);
  });
}

// Hook into language changes to lazy-load locale bundles
i18n.on('languageChanged', async (lng) => {
  const lang = lng.split('-')[0];
  if (lang !== 'en' && !i18n.hasResourceBundle(lang, 'translation')) {
    const translations = await loadLocale(lang);
    i18n.addResourceBundle(lang, 'translation', translations);
  }
});

export default i18n;
