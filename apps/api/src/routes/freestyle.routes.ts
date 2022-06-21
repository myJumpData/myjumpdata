import { Express } from "express-serve-static-core";
import {
  getFreestyle,
  getUserFreestyle,
  saveFreestyleData,
  saveFreestyleDataOwn,
} from "../controllers/freestyle.controller";
import verifyToken from "../middlewares/authJwt";

export default function FreestyleRoutes(app: Express) {
  app.get("/freestyle/:path", [verifyToken], getFreestyle);
  app.post("/freestyle_user/", [verifyToken], getUserFreestyle);
  app.get("/freestyle", [verifyToken], getFreestyle);
  app.post("/freestyle_own", [verifyToken], saveFreestyleDataOwn);
  app.post("/freestyle_group/:id", [verifyToken], saveFreestyleData);
}
