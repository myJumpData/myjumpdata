import api from "./api";

export const getFreestyle = (params: string) => {
  return api.get("/freestyle/" + params);
};
export const getFreestyleElement = (id: string) => {
  return api.get("/freestyle/element/" + id);
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
