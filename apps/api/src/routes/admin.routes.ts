import { Express } from "express-serve-static-core";
import {
  createFreestyle,
  createLocalization,
  deleteFreestyle,
  deleteLocalization,
  getFreestyleElement,
  getFreestyleTranslation,
  getUsers,
  getVersion,
  updateFreestyleElementGroups,
  updateFreestyleElementLevel,
} from "../controllers/admin.controller";
import verifyToken from "../middlewares/authJwt";
import { isAdmin } from "../middlewares/isAdmin";

export default function AdminRoutes(app: Express) {
  app.post(
    "/admin/localization/create",
    [verifyToken, isAdmin],
    createLocalization
  );
  app.post(
    "/admin/localization/delete",
    [verifyToken, isAdmin],
    deleteLocalization
  );

  app.post("/admin/freestyle/create", [verifyToken, isAdmin], createFreestyle);
  app.post("/admin/freestyle/delete", [verifyToken, isAdmin], deleteFreestyle);
  app.get(
    "/admin/freestyle/element/:id",
    [verifyToken, isAdmin],
    getFreestyleElement
  );
  app.post(
    "/admin/freestyle_update_level",
    [verifyToken, isAdmin],
    updateFreestyleElementLevel
  );
  app.post(
    "/admin/freestyle/update/groups",
    [verifyToken, isAdmin],
    updateFreestyleElementGroups
  );
  app.get(
    "/admin/freestyle/translation/:key",
    [verifyToken, isAdmin],
    getFreestyleTranslation
  );

  app.get("/admin/users", [verifyToken, isAdmin], getUsers);

  app.get("/admin/version", getVersion);
}
