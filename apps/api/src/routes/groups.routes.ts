import { Express } from "express-serve-static-core";
import {
  addAdminToClub,
  addAthletesToGroup,
  addCoachesToGroup,
  addCoachToClub,
  addMemberToClub,
  createGroup,
  deleteGroup,
  getClub,
  getGroup,
  getGroups,
  leaveGroup,
  removeAdminFromClub,
  removeAthletesFromGroup,
  removeCoachesFromGroup,
  removeCoachFromClub,
  removeMemberFromClub,
  updateGroupName,
} from "../controllers/groups.controller";
import verifyToken from "../middlewares/authJwt";
import { verifyGroupCoach } from "../middlewares/verifyGroupCoach";
import { verifyClubAdmin } from "../middlewares/verifyClubAdmin";

export default function GroupsRoutes(app: Express) {
  app.post("/groups", [verifyToken], createGroup);

  app.get("/groups", [verifyToken], getGroups);

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

  app.get("/groups/:id", [verifyToken], getGroup);
  app.post(
    "/groups/:id/athletes/add",
    [verifyToken, verifyGroupCoach],
    addAthletesToGroup
  );
  app.post(
    "/groups/:id/athletes/remove",
    [verifyToken, verifyGroupCoach],
    removeAthletesFromGroup
  );
  app.post(
    "/groups/:id/coaches/add",
    [verifyToken, verifyGroupCoach],
    addCoachesToGroup
  );
  app.post(
    "/groups/:id/coaches/remove",
    [verifyToken, verifyGroupCoach],
    removeCoachesFromGroup
  );
  app.post(
    "/groups_name/:id",
    [verifyToken, verifyGroupCoach],
    updateGroupName
  );
  app.post("/group_del/:id", [verifyToken, verifyGroupCoach], deleteGroup);
  app.post("/group_leave/:id", [verifyToken], leaveGroup);
}
