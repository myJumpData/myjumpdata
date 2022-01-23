import api from "./api";

export const getFreestyle = (params) => {
  return api.get("/freestyle" + params);
};
