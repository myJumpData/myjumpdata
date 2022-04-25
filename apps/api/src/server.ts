import cors from "cors";
import express from "express";
import { APP_URL } from "./consts/host";
import FreestyleRoutes from "./routes/freestyle.routes";
import GroupsRoutes from "./routes/groups.routes";
import LocalesRoutes from "./routes/locales.routes";
import ScoredataRoutes from "./routes/scoredata.routes";
import UserRoutes from "./routes/user.routes";
import UsersRoutes from "./routes/users.routes";

export default function createServer() {
  const app = express();
  app.use(
    cors({
      origin: APP_URL,
    })
  );
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", APP_URL);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
  });
  app.use(express.json());
  UserRoutes(app);
  UsersRoutes(app);
  ScoredataRoutes(app);
  GroupsRoutes(app);
  FreestyleRoutes(app);
  LocalesRoutes(app);
  return app;
}
