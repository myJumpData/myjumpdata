import api from "./api";

const getScoreDataTypes = () => {
  return api.get("/scoredata/types");
};

const saveScoreData = (user: any, type: any, score: any) => {
  return api.post("/scoredata", {user, type, score});
};

const getScoreDataHigh = (id: any, type: any) => {
  return api.get(`/scoredata/high/${id}/${type}`);
};

const getScoreDataOwn = () => {
  return api.get(`/scoredata/own`);
};

const saveScoreDataOwn = (type: any, score: any) => {
  return api.post("/scoredata/own", {type, score});
};

const ScoreDataService = {
  getScoreDataTypes,
  saveScoreData,
  getScoreDataHigh,
  getScoreDataOwn,
  saveScoreDataOwn,
};

export default ScoreDataService;
