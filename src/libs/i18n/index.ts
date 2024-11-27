import { languageOptions, namespaces } from '@/config/locales';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend'; // adding lazy loading for translations, more information here: https://github.com/i18next/i18next-http-backend
import { initReactI18next } from 'react-i18next';
import { i18nextPlugin } from 'translation-check';
import { setLocale } from 'yup';
import { en, nl } from 'yup-locales';

// /**
//  * Default localization settings. the locales are retrieved from the public URL. Namespaces are common and application specific
//  *
//  */
// i18n
//   .use(Backend)
//   .use(initReactI18next)
//   .use(LanguageDetector) // Detect user language
//   .init({
//     //supportedLngs: ["en", "de"],
//     backend: {
//       loadPath: '/locales/{{lng}}/{{ns}}.json', // locale files path
//     },
//     ns: ['satisfactory'],
//     lng: 'en',
//     defaultNS: 'common',
//     fallbackLng: ['en'],
//     supportedLngs: ['en', 'nl'],
//   });

const languages = {
  en,
  nl,
};

const customSaveMissingKeys = (
  key: string,
  defaultValue: any,
  ns: string,
  lng: readonly string[]
) => {
  // Get array of missing keys from localstorage
  const missingKeysArray = JSON.parse(localStorage.getItem('missingKeys') || '[]');
  // If key, ns and lng already exist, return
  const existingKey = missingKeysArray.find(
    (item: any) => item.key === key && item.ns === ns && item.lng.includes(lng[0])
  );
  if (existingKey) return;
  missingKeysArray.push({ key, defaultValue, ns, lng });
  // Save to localstorage
  localStorage.setItem('missingKeys', JSON.stringify(missingKeysArray));
};

export interface LanguageOptions {
  [key: string]: {
    icon: string;
    label: string;
  };
}

const missingKeys: Record<string, string> = {};

const initI18n = () => {
  i18n
    .use(Backend) // Load translations dynamically if needed
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Bind i18n to React
    .use(i18nextPlugin) // GUI
    .init({
      fallbackLng: 'en',
      supportedLngs: Object.keys(languageOptions),
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json', // locale files path
      },
      saveMissing: true, // Enable missing key reporting
      defaultNS: 'common',
      ns: namespaces,
      debug: true, // Optional: Debug missing keys in the console
      interpolation: {
        escapeValue: false, // React already escapes
      },
      saveMissingTo: 'current',
      missingKeyHandler: (lng, ns, key, fallbackValue) => {
        // Save missing keys and their fallback
        missingKeys[key] = fallbackValue || '';
        console.warn(`[i18n] Missing key: "${key}"`);
        customSaveMissingKeys(key, fallbackValue || '', ns, lng);
      },
      returnObjects: true,
    });
};

if (!i18n.isInitialized) {
  initI18n();
  const lng = i18n.language || localStorage.getItem('i18nextLng') || 'en';
  setLocale(languages[lng as keyof typeof languages]);
  // console.log(languages[i18n.language as keyof typeof languages]);
  // console.log(nl);
  // console.log(i18n.language);
  // const locale = languages[(i18n.language as keyof typeof languages) || 'en'];
  // console.log(i18n, locale);
  // setLocale(locale);
}
// console.log('i18n start', i18n);
// const locale = languages[(i18n.language as keyof typeof languages) || 'en'];
// console.log(locale);
// setLocale(locale);

// Listen for language changes
i18n.on('languageChanged', (lng: keyof typeof languages) => {
  setLocale(languages[lng]);
});

// i18n
//   .use(Backend) // Load translations dynamically if needed
//   .use(LanguageDetector) // Detect user language
//   .use(initReactI18next) // Bind i18n to React
//   .use(i18nextPlugin) // GUI
//   .init({
//     fallbackLng: 'en',
//     supportedLngs: Object.keys(languageOptions),
//     backend: {
//       loadPath: '/locales/{{lng}}/{{ns}}.json', // locale files path
//     },
//     saveMissing: true, // Enable missing key reporting
//     defaultNS: 'common',
//     ns: namespaces,
//     debug: true, // Optional: Debug missing keys in the console
//     interpolation: {
//       escapeValue: false, // React already escapes
//     },
//     saveMissingTo: 'current',
//     missingKeyHandler: (lng, ns, key, fallbackValue) => {
//       // Save missing keys and their fallback
//       missingKeys[key] = fallbackValue || '';
//       console.warn(`[i18n] Missing key: "${key}"`);
//     },
//     returnObjects: true,
//   });

// console.log(showTranslations(en_common));

export default initI18n;
