import api from "./api";

export const getFreestyle = (params: string) => {
  return api.get("/freestyle" + params);
};
