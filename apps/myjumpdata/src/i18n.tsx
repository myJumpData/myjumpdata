import i18n from "i18next";
import Http from "i18next-http-backend";
import BackendAdapter from "i18next-multiload-backend-adapter";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, LANGUAGES, NAMESPACES } from "./Constants";
import api from "./service/api";
import getApi from "./utils/getApi";
import { getLang } from "./utils/getLang";

i18n
  .use(BackendAdapter)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGES,
    ns: NAMESPACES.filter((e) => e !== "main" && e !== "freestyle"),
    defaultNS: "translation",
    lowerCaseLng: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false,
    },
    lng: getLang(),
    saveMissing: true,
    missingKeyHandler: (_, ns, key) => {
      api
        .post("/locales", {
          ns,
          key,
        })
        .then(() => {});
    },
    backend: {
      backend: Http,
      backendOption: {
        loadPath: `${getApi()}/locales/{{lng}}/{{ns}}`,
      },
    },
  } as any)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .then(() => {});
