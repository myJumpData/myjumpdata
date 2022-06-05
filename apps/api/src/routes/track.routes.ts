import { Express } from "express-serve-static-core";
import verifyToken from "../middlewares/authJwt";
import { verifyGroupCoach } from "../middlewares/verifyGroupCoach";
import {
  deleteFreestyleGroupTrack,
  deleteFreestyleTeamTrack,
  deleteFreestyleTrack,
  getFile,
  getFreestyleGroupTrack,
  getFreestyleTeamTrack,
  getFreestyleTrack,
  uploadFreestyleGroupTrack,
  uploadFreestyleTeamTrack,
  uploadFreestyleTrack,
} from "../controllers/track.controller";
import { verifyTeamCoach } from "../middlewares/verifyTeamCoach";

export default function TrackRoutes(app: Express) {
  app.get(
    "/track/freestyle_group/:id",
    [verifyToken, verifyGroupCoach],
    getFreestyleGroupTrack
  );
  app.get("/track/freestyle", [verifyToken], getFreestyleTrack);
  app.get("/upload/:file", getFile);
  app.post(
    "/delete/track_group/freestyle/:id",
    [verifyToken, verifyGroupCoach],
    deleteFreestyleGroupTrack
  );
  app.post("/delete/track/freestyle", [verifyToken], deleteFreestyleTrack);
  app.post(
    "/upload/track_group/freestyle/:id",
    [verifyToken, verifyGroupCoach],
    uploadFreestyleGroupTrack
  );
  app.post("/upload/track/freestyle", [verifyToken], uploadFreestyleTrack);
  app.post(
    "/upload/track_team/freestyle/:id",
    [verifyToken, verifyTeamCoach],
    uploadFreestyleTeamTrack
  );
  app.get("/track/freestyle_team/:id", [verifyToken], getFreestyleTeamTrack);
  app.post(
    "/delete/track_team/freestyle/:id",
    [verifyToken, verifyTeamCoach],
    deleteFreestyleTeamTrack
  );
}
