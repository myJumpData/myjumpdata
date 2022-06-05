import { Express } from "express-serve-static-core";
import verifyToken from "../middlewares/authJwt";
import { verifyGroupCoach } from "../middlewares/verifyGroupCoach";
import {
  deleteFreestyleGroupTrack,
  deleteFreestyleTrack,
  getFile,
  getFreestyleGroupTrack,
  getFreestyleTrack,
  uploadFreestyleGroupTrack,
  uploadFreestyleTrack,
} from "../controllers/track.controller";

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
}
