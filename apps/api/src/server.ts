import { APP_URL } from "@myjumpdata/consts";
import cors from "cors";
import express from "express";
import Translation from "./models/translation.model";
import { requestHandlerError } from "./requestHandler";
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
  app.get("/locales/:lng/:ns", (req, res) => {
    const lng = req.params.lng;
    const ns = req.params.ns;
    Translation.find({ language: lng, namespace: ns })
      .select("-_id -__v -language -namespace")
      .exec((err, translation_data) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        if (translation_data.length > 0) {
          const map_data = {};
          translation_data.forEach(
            ({ key, translation }: { key: string; translation: string }) => {
              return (map_data[key] = translation);
            }
          );
          return res.status(200).send(map_data);
        }
      });
  });
  return app;
}
