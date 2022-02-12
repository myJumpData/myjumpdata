import api from "./api";

export const getScoreDataTypes = () => {
  return api.get("/scoredata/types");
};

export const saveScoreData = (
  user: string,
  type: string,
  score: number,
  date: Date
) => {
  return api.post("/scoredata", { user, type, score, date });
};

export const getScoreDataHigh = (id: string, type: string) => {
  return api.get(`/scoredata/high/${id}/${type}`);
};

export const getScoreDataOwn = () => {
  return api.get(`/scoredata/own`);
};

export const resetScoreDataOwn = (type: string, score: number) => {
  return api.post("/scoredata/own/reset", { type, score });
};

export const resetScoreData = (user: string, type: string, score: number) => {
  return api.post("/scoredata/reset", { user, type, score });
};

export const saveScoreDataOwn = (type: string, score: number, date: Date) => {
  return api.post("/scoredata/own", { type, score, date });
};
