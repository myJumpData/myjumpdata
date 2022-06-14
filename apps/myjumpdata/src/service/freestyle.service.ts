import api from "./api";

export const getFreestyle = (params: string) => {
  return api.get("/freestyle/" + params);
};
export const saveFreestyleDataOwn = (element: string, state: boolean) => {
  return api.post("/freestyle_own", { element, state });
};
export const saveFreestyleData = (
  user: string,
  element: string,
  state: boolean
) => {
  return api.post("/freestyle_group/" + user, { element, state });
};
export const getUserFreestyle = (user: string[], freestyle: string[]) => {
  return api.post("/freestyle_user", { user, freestyle });
};
