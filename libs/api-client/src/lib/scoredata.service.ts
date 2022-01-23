import api from "./api";

export const getScoreDataTypes = () => {
  return api.get("/scoredata/types");
};

export const saveScoreData = (user, type, score, date) => {
  return api.post("/scoredata", { user, type, score, date });
};

export const getScoreDataHigh = (id, type) => {
  return api.get(`/scoredata/high/${id}/${type}`);
};

export const getScoreDataOwn = () => {
  return api.get(`/scoredata/own`);
};

export const saveScoreDataOwn = (type, score, date) => {
  return api.post("/scoredata/own", { type, score, date });
};
