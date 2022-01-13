import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';
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
