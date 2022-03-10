import { Express } from "express-serve-static-core";
import { getLocales, getTranslations } from "../controllers/locales.controller";
import verifyToken from "../middlewares/authJwt";

export default function LocalesRoutes(app: Express) {
  app.get("/locales", [verifyToken], getTranslations);
  app.get("/locales/:lng/:ns", getLocales);
}
