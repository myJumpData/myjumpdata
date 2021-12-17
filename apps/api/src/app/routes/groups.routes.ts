import {Express} from "express-serve-static-core";
import {
  addAthletesToGroup,
  addCoachesToGroup,
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  removeAthletesFromGroup,
  removeCoachesFromGroup,
  updateGroupName,
} from "../controllers/groups.controller";
import verifyToken from "../middlewares/authJwt";
import {verifyGroupCoach} from "../middlewares/verifyGroupCoach";

export default function GroupsRoutes(app: Express) {
  app.post("/groups", [verifyToken], createGroup);

  app.get("/groups", [verifyToken], getGroups);
  app.get("/groups/:id", [verifyToken], getGroup);
  app.put(
    "/groups/:id/athletes/add",
    [verifyToken, verifyGroupCoach],
    addAthletesToGroup
  );
  app.put(
    "/groups/:id/athletes/remove",
    [verifyToken, verifyGroupCoach],
    removeAthletesFromGroup
  );
  app.put("/groups/:id/coaches/add", [verifyToken, verifyGroupCoach], addCoachesToGroup);
  app.put(
    "/groups/:id/coaches/remove",
    [verifyToken, verifyGroupCoach],
    removeCoachesFromGroup
  );
  app.put("/groups/:id", [verifyToken, verifyGroupCoach], updateGroupName);
  app.delete("/group/:id", [verifyToken, verifyGroupCoach], deleteGroup);
}
