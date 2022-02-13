import { LANGUAGES } from "@myjumpdata/const";
import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(detector)
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: LANGUAGES,
    ns: ["translation", "common", "main", "freestyle"],
    defaultNS: "translation",
    lowerCaseLng: true,
    cleanCode: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3333"
          : "https://api.myjumpdata.fediv.me"
      }/locales/{{lng}}/{{ns}}`,
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage", "cookie"],
    },
  });
