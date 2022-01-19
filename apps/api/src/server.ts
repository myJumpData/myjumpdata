import cors from "cors";
import express from "express";
import * as fs from "fs";
import { APP_URL } from "./config/host.config";
import FreestyleRoutes from "./routes/freestyle.routes";
import GroupsRoutes from "./routes/groups.routes";
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
  app.use(express.json());
  UserRoutes(app);
  UsersRoutes(app);
  ScoredataRoutes(app);
  GroupsRoutes(app);
  FreestyleRoutes(app);
  app.get("/locales/:lng/:ns", (req, res) => {
    const lng = req.params.lng;
    const ns = req.params.ns;
    fs.readFile(
      "./apps/api/src/locales/" + lng + "/" + ns + ".json",
      (err, data) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(data);
      }
    );
  });
  return app;
}
