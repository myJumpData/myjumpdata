import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import backend from 'i18next-xhr-backend';
import detector from 'i18next-browser-languagedetector';
import { CONF } from './Constants';

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'],
    ns: ['translation', 'common', 'main', 'footermain'],
    defaultNS: 'translation',
    lowerCaseLng: true,
    cleanCode: true,
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${CONF.API_URL}/locales/{{lng}}/{{ns}}`,
    },
    detection: {
      order: ['navigator'],
      caches: [],
    },
  });
