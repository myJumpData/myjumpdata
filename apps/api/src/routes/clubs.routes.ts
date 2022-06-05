import verifyToken from "../middlewares/authJwt";
import {
  addAdminToClub,
  addCoachToClub,
  addMemberToClub,
  getClub,
  leaveClub,
  removeAdminFromClub,
  removeCoachFromClub,
  removeMemberFromClub,
} from "../controllers/clubs.controller";
import { verifyClubAdmin } from "../middlewares/verifyClubAdmin";
import { Express } from "express-serve-static-core";

export default function ClubsRoutes(app: Express) {
  app.get("/club/:id", [verifyToken], getClub);
  app.get("/club", [verifyToken], getClub);
  app.post(
    "/club/:id/athletes/add",
    [verifyToken, verifyClubAdmin],
    addMemberToClub
  );
  app.post(
    "/club/:id/athletes/remove",
    [verifyToken, verifyClubAdmin],
    removeMemberFromClub
  );
  app.post(
    "/club/:id/coaches/add",
    [verifyToken, verifyClubAdmin],
    addCoachToClub
  );
  app.post(
    "/club/:id/coaches/remove",
    [verifyToken, verifyClubAdmin],
    removeCoachFromClub
  );
  app.post(
    "/club/:id/admins/add",
    [verifyToken, verifyClubAdmin],
    addAdminToClub
  );
  app.post(
    "/club/:id/admins/remove",
    [verifyToken, verifyClubAdmin],
    removeAdminFromClub
  );
  app.post("/club_leave", [verifyToken], leaveClub);
}
