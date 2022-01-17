import { Express } from "express-serve-static-core";
import {
  getScoreDataHigh,
  getScoreDataOwn,
  getScoreDataTypes,
  saveScoreData,
  saveScoreDataOwn,
} from "../controllers/scoredata.controller";
import verifyToken from "../middlewares/authJwt";
import {
  bodyCheckNullDate,
  bodyCheckNullScore,
  bodyCheckNullType,
  bodyCheckNullUser,
} from "../middlewares/bodyCheck";

export default function ScoredataRoutes(app: Express) {
  app.post(
    "/scoredata",
    [
      verifyToken,
      bodyCheckNullDate,
      bodyCheckNullType,
      bodyCheckNullScore,
      bodyCheckNullUser,
    ],
    saveScoreData
  );
  app.get("/scoredata/types", [verifyToken], getScoreDataTypes);
  app.get("/scoredata/own", [verifyToken], getScoreDataOwn);
  app.post(
    "/scoredata/own",
    [verifyToken, bodyCheckNullDate, bodyCheckNullType, bodyCheckNullScore],
    saveScoreDataOwn
  );
  app.get("/scoredata/high/:id/:type", [verifyToken], getScoreDataHigh);
}
