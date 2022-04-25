import i18n from "i18next";
import i18nHttpLoader from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";
import { LANGUAGES, NAMESPACES } from "./app/Constants";

i18n
  .use(i18nHttpLoader)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: LANGUAGES,
    ns: NAMESPACES,
    defaultNS: "translation",
    lowerCaseLng: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false,
    },
    lng: getLocales()[0].languageCode,
    compatibilityJSON: "v3",
    backend: {
      loadPath: "https://api.myjumpdata.fediv.me/locales/{{lng}}/{{ns}}",
    },
  });
