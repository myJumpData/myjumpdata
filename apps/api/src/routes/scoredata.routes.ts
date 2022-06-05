import { Express } from "express-serve-static-core";
import {
  getScoreDataHigh,
  getScoreDataHighTeam,
  getScoreDataOwn,
  getScoreDataTypes,
  getScoreDataTypesTeam,
  resetScoreData,
  resetScoreDataOwn,
  resetScoreDataTeam,
  saveScoreData,
  saveScoreDataOwn,
  saveScoreDataTeam,
} from "../controllers/scoredata.controller";
import verifyToken from "../middlewares/authJwt";
import {
  bodyCheckNullDate,
  bodyCheckNullScore,
  bodyCheckNullType,
  bodyCheckNullUser,
} from "../middlewares/bodyCheck";
import { verifyTeamCoach } from "../middlewares/verifyTeamCoach";

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
  app.post(
    "/scoredata/team/:id",
    [verifyToken, verifyTeamCoach],
    saveScoreDataTeam
  );
  app.post(
    "/scoredata/reset",
    [verifyToken, bodyCheckNullType, bodyCheckNullScore, bodyCheckNullUser],
    resetScoreData
  );
  app.get("/scoredata/types", [verifyToken], getScoreDataTypes);
  app.get("/scoredata/typesTeam", [verifyToken], getScoreDataTypesTeam);
  app.get("/scoredata/own", [verifyToken], getScoreDataOwn);
  app.post(
    "/scoredata/own/reset",
    [verifyToken, bodyCheckNullType, bodyCheckNullScore],
    resetScoreDataOwn
  );
  app.post(
    "/scoredata/own",
    [verifyToken, bodyCheckNullDate, bodyCheckNullType, bodyCheckNullScore],
    saveScoreDataOwn
  );
  app.get("/scoredata/high/:id/:type", [verifyToken], getScoreDataHigh);
  app.get(
    "/scoredata/team/:id",
    [verifyToken, verifyTeamCoach],
    getScoreDataHighTeam
  );
  app.post(
    "/scoredata/team/:id/reset",
    [verifyToken, verifyTeamCoach],
    resetScoreDataTeam
  );
}
