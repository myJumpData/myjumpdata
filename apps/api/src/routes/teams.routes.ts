import verifyToken from "../middlewares/authJwt";
import {
  addAthletesToTeam,
  addCoachesToTeam,
  createTeam,
  deleteTeam,
  getTeam,
  getTeams,
  leaveTeam,
  removeAthletesFromTeam,
  removeCoachesFromTeam,
  updateTeamName,
} from "../controllers/teams.controller";
import { Express } from "express-serve-static-core";
import { verifyTeamCoach } from "../middlewares/verifyTeamCoach";

export default function TeamsRoutes(app: Express) {
  app.get("/team/:id", [verifyToken], getTeam);
  app.get("/teams", [verifyToken], getTeams);
  app.post("/team", [verifyToken], createTeam);
  app.post("/team_name/:id", [verifyToken, verifyTeamCoach], updateTeamName);
  app.post("/team_del/:id", [verifyToken, verifyTeamCoach], deleteTeam);
  app.post(
    "/team/:id/athletes/add",
    [verifyToken, verifyTeamCoach],
    addAthletesToTeam
  );
  app.post(
    "/team/:id/athletes/remove",
    [verifyToken, verifyTeamCoach],
    removeAthletesFromTeam
  );
  app.post(
    "/team/:id/coaches/add",
    [verifyToken, verifyTeamCoach],
    addCoachesToTeam
  );
  app.post(
    "/team/:id/coaches/remove",
    [verifyToken, verifyTeamCoach],
    removeCoachesFromTeam
  );
  app.post("/team_leave/:id", [verifyToken], leaveTeam);
}
