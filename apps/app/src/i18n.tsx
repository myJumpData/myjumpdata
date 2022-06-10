import i18n from "i18next";
import Http from "i18next-http-backend";
import BackendAdapter from "i18next-multiload-backend-adapter";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";
import { DEFAULT_LANGUAGE, LANGUAGES, NAMESPACES } from "./app/Constants";
import getApi from "./app/utils/getApi";

i18n
  .use(BackendAdapter)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGES,
    ns: NAMESPACES,
    defaultNS: "translation",
    lowerCaseLng: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false,
    },
    lng: (() => {
      const all = getLocales();
      const map = all.map((item: any) => item.languageCode.toLowerCase());
      const filter = map.filter((e) => LANGUAGES.some((i) => i === e));
      return filter[0];
    })(),
    compatibilityJSON: "v3",
    backend: {
      backend: Http,
      backendOption: {
        loadPath: `${getApi()}/locales/{{lng}}/{{ns}}`,
      },
    },
  } as any)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .then(() => {});
