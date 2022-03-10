import api from "./api";

export const getTranslations = (namespace: string) => {
  return api.get(`/locales?namespace=${namespace}`);
};
