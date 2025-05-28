import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

// Initialize i18next
i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    fallbackLng: 'en',
    lng: localStorage.getItem('i18nextLng') || navigator.language?.substring(0, 2) === 'en' ? 'en' : 'fr',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: function(value, format) {
        // Special formatting for year to ensure it's treated as a number
        if (format === 'year' && typeof value === 'number') {
          return value.toString();
        }
        return value;
      }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    debug: false // Only enable this in development if needed
  });

// Log when i18n is initialized
i18n.on('initialized', () => {
  console.log('i18n initialized successfully with language:', i18n.language);
});

// Handle language changes
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  document.documentElement.lang = lng;
});

export default i18n; 