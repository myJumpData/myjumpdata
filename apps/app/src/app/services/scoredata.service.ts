import api from "./api";

const getScoreDataTypes = () => {
  return api.get("/scoredata/types");
};

const saveScoreData = (user: any, type: any, score: number, date: Date) => {
  return api.post("/scoredata", { user, type, score, date });
};

const getScoreDataHigh = (id: any, type: any) => {
  return api.get(`/scoredata/high/${id}/${type}`);
};

const getScoreDataOwn = () => {
  return api.get(`/scoredata/own`);
};

const resetScoreDataOwn = (type: string, score: number) => {
  return api.post("/scoredata/own/reset", { type, score });
};

const resetScoreData = (user: string, type: string, score: number) => {
  return api.post("/scoredata/reset", { user, type, score });
};

const saveScoreDataOwn = (type: any, score: number, date: Date) => {
  return api.post("/scoredata/own", { type, score, date });
};

const ScoreDataService = {
  getScoreDataTypes,
  saveScoreData,
  getScoreDataHigh,
  getScoreDataOwn,
  resetScoreDataOwn,
  resetScoreData,
  saveScoreDataOwn,
};

export default ScoreDataService;
