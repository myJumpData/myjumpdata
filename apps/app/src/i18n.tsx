import i18n from "i18next";
import Http from "i18next-http-backend";
import BackendAdapter from "i18next-multiload-backend-adapter";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";
import { LANGUAGES, NAMESPACES } from "./app/Constants";
import getApi from "./app/utils/getApi";

i18n
  .use(BackendAdapter)
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
      backend: Http,
      backendOption: {
        loadPath: `${getApi()}/locales/{{lng}}/{{ns}}`,
      },
    },
  } as any);
