import { Express } from "express-serve-static-core";
import {
  createFreestyle,
  getFreestyle,
  getFreestyleData,
  getFreestyleDataOwn,
  getFreestyleElement,
  getFreestyleTranslation,
  saveFreestyleData,
  saveFreestyleDataOwn,
  updateFreestyleElementLevel,
} from "../controllers/freestyle.controller";
import verifyToken from "../middlewares/authJwt";

export default function FreestyleRoutes(app: Express) {
  app.get("/freestyle/element/:id", [verifyToken], getFreestyleElement);
  app.get(
    "/freestyle/translation/:key",
    [verifyToken],
    getFreestyleTranslation
  );
  app.post("/freestyle/create", [verifyToken], createFreestyle);
  app.get("/freestyle/:path", [verifyToken], getFreestyle);
  app.get("/freestyle", [verifyToken], getFreestyle);
  app.get("/freestyle_own", [verifyToken], getFreestyleDataOwn);
  app.post("/freestyle_own", [verifyToken], saveFreestyleDataOwn);
  app.get("/freestyle_group/:id", [verifyToken], getFreestyleData);
  app.post("/freestyle_group/:id", [verifyToken], saveFreestyleData);
  app.post(
    "/freestyle_update_level",
    [verifyToken],
    updateFreestyleElementLevel
  );
}
