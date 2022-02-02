import api from "./api";

export const getFreestyle = (params: string) => {
  return api.get("/freestyle/" + params);
};

export const getFreestyleDataOwn = () => {
  return api.get("/freestyle_own");
};
export const saveFreestyleDataOwn = (element: string, state: boolean) => {
  return api.post("/freestyle_own", { element, state });
};
