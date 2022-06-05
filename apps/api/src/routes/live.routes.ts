import { Express } from "express-serve-static-core";
import verifyToken from "../middlewares/authJwt";
import {
  createCounter,
  getcounter,
  setCounter,
} from "../controllers/live.controller";

export default function LiveRoutes(app: Express) {
  app.post("/live/counter/get", [verifyToken], getcounter);
  app.post("/live/counter/create", [verifyToken], createCounter);
  app.post("/live/counter/set", [verifyToken], setCounter);
}
