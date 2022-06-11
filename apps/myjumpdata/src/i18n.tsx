import i18n from "i18next";
import Http from "i18next-http-backend";
import BackendAdapter from "i18next-multiload-backend-adapter";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE, LANGUAGES, NAMESPACES } from "./Constants";
import getApi from "./utils/getApi";

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
    lng: (() => {
      let lngs: string[] = [];
      if (navigator.languages) {
        for (let i = 0; i < navigator.languages.length; i++) {
          lngs.push(navigator.languages[i]);
        }
      }
      if (navigator["userLanguage"]) {
        lngs.push(navigator["userLanguage"]);
      }
      if (navigator.language) {
        lngs.push(navigator.language);
      }
      lngs = lngs.map((e) => e.split("-")[0]);
      lngs = lngs.map((e) => (e === "uk" ? "ua" : e));
      lngs = [...new Set(lngs)];
      const filter = lngs.filter((e) => LANGUAGES.some((i) => i === e));
      return filter[0];
    })(),
    backend: {
      backend: Http,
      backendOption: {
        loadPath: `${getApi()}/locales/{{lng}}/{{ns}}`,
      },
    },
    /*detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
    },*/
  } as any)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .then(() => {});
