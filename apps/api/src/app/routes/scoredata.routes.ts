import {Express} from "express-serve-static-core";
import {
  getScoreDataHigh,
  getScoreDataOwn,
  getScoreDataTypes,
  saveScoreData,
  saveScoreDataOwn,
} from "../controllers/scoredata.controller";
import verifyToken from "../middlewares/authJwt";

export default function ScoredataRoutes(app: Express) {
  app.post("/scoredata", [verifyToken], saveScoreData);
  app.get("/scoredata/types", [verifyToken], getScoreDataTypes);
  app.get("/scoredata/own", [verifyToken], getScoreDataOwn);
  app.post("/scoredata/own", [verifyToken], saveScoreDataOwn);
  app.get("/scoredata/high/:id/:type", [verifyToken], getScoreDataHigh);
}
