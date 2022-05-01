import api from "./api";

export const createLocalization = (
  namespace: string,
  key: string,
  translations: any
) => {
  return api.post("/admin/localization/create", {
    namespace,
    key,
    translations,
  });
};

export const deleteLocalization = (namespace: string, key: string) => {
  return api.post("/admin/localization/delete", {
    key,
    namespace,
  });
};
