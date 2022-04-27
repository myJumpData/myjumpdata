import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import Http from "i18next-http-backend";
import BackendAdapter from "i18next-multiload-backend-adapter";
import { initReactI18next } from "react-i18next";
import { LANGUAGES, NAMESPACES } from "./Constants";
import getApi from "./utils/getApi";

i18n
  .use(detector)
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
    backend: {
      backend: Http,
      backendOption: {
        loadPath: `${getApi()}/locales/{{lng}}/{{ns}}`,
      },
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
    },
  } as any);
