import { Express } from "express-serve-static-core";
import {
  createFreestyle,
  getFreestyle,
  getFreestyleDataOwn,
  saveFreestyleDataOwn,
} from "../controllers/freestyle.controller";
import verifyToken from "../middlewares/authJwt";

export default function FreestyleRoutes(app: Express) {
  app.get("/freestyle/:path", getFreestyle);
  app.get("/freestyle", getFreestyle);
  app.get("/freestyle_own", [verifyToken], getFreestyleDataOwn);
  app.post("/freestyle_own", [verifyToken], saveFreestyleDataOwn);
  app.post("/fs", createFreestyle);
}
