import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import { APP_URL } from "./consts/host";
import AdminRoutes from "./routes/admin.routes";
import FreestyleRoutes from "./routes/freestyle.routes";
import GroupsRoutes from "./routes/groups.routes";
import LocalesRoutes from "./routes/locales.routes";
import ScoredataRoutes from "./routes/scoredata.routes";
import UserRoutes from "./routes/user.routes";
import UsersRoutes from "./routes/users.routes";
import TeamsRoutes from "./routes/teams.routes";
import TrackRoutes from "./routes/track.routes";
import LiveRoutes from "./routes/live.routes";
import Socket from "./socket";
import ClubsRoutes from "./routes/clubs.routes";

export default function createServer() {
  const app = express();

  const io = new Server({
    transports: ["websocket"],
    cors: {
      origin: APP_URL,
      methods: ["GET", "POST"],
    },
  });

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
  app.use(
    fileUpload({
      createParentPath: true,
      limits: {
        fileSize: 1024 * 1024 * 50,
      },
      abortOnLimit: true,
    })
  );

  Socket(io);

  AdminRoutes(app);
  ClubsRoutes(app);
  FreestyleRoutes(app);
  GroupsRoutes(app);
  LiveRoutes(app);
  LocalesRoutes(app);
  ScoredataRoutes(app);
  TeamsRoutes(app);
  TrackRoutes(app);
  UserRoutes(app);
  UsersRoutes(app);
  return { app, io };
}
