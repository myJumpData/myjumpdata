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
export const updateLocalization = (ids: string[], data: any) => {
  return api.post("/admin/localization/update", {
    ids,
    data,
  });
};
export const getLocalization = (namespace: string, key: string) => {
  return api.get("/admin/localization/" + namespace + "/" + key);
};

export const createFreestyle = (
  key: string,
  level: string,
  groups: string[]
) => {
  return api.post("/admin/freestyle/create", { key, level, groups });
};
export const deleteFreestyle = (id: string) => {
  return api.post("/admin/freestyle/delete", { id });
};
export const getFreestyleElement = (id: string) => {
  return api.get("/admin/freestyle/element/" + id);
};
export const updateFreestyleElementLevel = (id, level) => {
  return api.post("/admin/freestyle_update_level", { level, id });
};
export const updateFreestyleElementKey = (id, key) => {
  return api.post("/admin/freestyle/update/key", { key, id });
};
export const getFreestyleTranslation = (key: string) => {
  return api.get("/admin/freestyle/translation/" + key);
};
export const updateFreestyleElementGroups = (id: string, groups: string[]) => {
  return api.post("/admin/freestyle/update/groups", { id, groups });
};
export const createFreestyleGroup = (key: string, parent: string) => {
  return api.post("/admin/freestyle_group/create", { key, parent });
};
export const deleteFreestyleGroup = (key: string) => {
  return api.post("/admin/freestyle_group/delete", { key });
};

export const getUsers = (page: number, limit: number) => {
  return api.get(`/admin/users?page=${page}&limit=${limit}`);
};

export const createClub = (
  name: string,
  country: string,
  state: string,
  city: string,
  logo: string
) => {
  return api.post("/admin/club/create", { name, country, state, city, logo });
};
export const getClubs = (page: number, limit: number) => {
  return api.get(`/admin/club?page=${page}&limit=${limit}`);
};
