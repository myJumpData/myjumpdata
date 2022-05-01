import { Express } from "express-serve-static-core";
import {
  createLocalization,
  deleteLocalization,
  getUsers,
} from "../controllers/admin.controller";
import verifyToken from "../middlewares/authJwt";

export default function AdminRoutes(app: Express) {
  app.post("/admin/localization/create", [verifyToken], createLocalization);
  app.post("/admin/localization/delete", [verifyToken], deleteLocalization);

  app.get("/admin/users", [verifyToken], getUsers);
}
