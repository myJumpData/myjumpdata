import api from "./api";

export const getFreestyle = (params: string) => {
  return api.get("/freestyle/" + params);
};
export const getFreestyleElement = (id: string) => {
  return api.get("/freestyle/element/" + id);
};
export const getFreestyleTranslation = (key: string) => {
  return api.get("/freestyle/translation/" + key);
};
export const deleteFreestyle = (id: string) => {
  return api.post("/freestyle/delete", { id });
};
export const createFreestyle = (
  key: string,
  level: string,
  groups: string[]
) => {
  return api.post("/freestyle/create", { key, level, groups });
};

export const getFreestyleDataOwn = () => {
  return api.get("/freestyle_own");
};
export const saveFreestyleDataOwn = (element: string, state: boolean) => {
  return api.post("/freestyle_own", { element, state });
};

export const getFreestyleData = (user: string) => {
  return api.get("/freestyle_group/" + user);
};
export const saveFreestyleData = (
  user: string,
  element: string,
  state: boolean
) => {
  return api.post("/freestyle_group/" + user, { element, state });
};

export const updateFreestyleElementLevel = (id, level) => {
  return api.post("/freestyle_update_level", { level, id });
};
