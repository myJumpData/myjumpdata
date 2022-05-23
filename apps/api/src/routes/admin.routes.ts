import { Express } from "express-serve-static-core";
import {
  createClub,
  createFreestyle,
  createFreestyleGroup,
  createLocalization,
  deleteFreestyle,
  deleteFreestyleGroup,
  deleteLocalization,
  getClubs,
  getFreestyleElement,
  getFreestyleTranslation,
  getUsers,
  getVersion,
  updateFreestyleElementGroups,
  updateFreestyleElementKey,
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
    "/admin/freestyle/update/key",
    [verifyToken, isAdmin],
    updateFreestyleElementKey
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
  app.post(
    "/admin/freestyle_group/create",
    [verifyToken, isAdmin],
    createFreestyleGroup
  );
  app.post(
    "/admin/freestyle_group/delete",
    [verifyToken, isAdmin],
    deleteFreestyleGroup
  );

  app.get("/admin/users", [verifyToken, isAdmin], getUsers);

  app.get("/admin/version", getVersion);

  app.post("/admin/club/create", [verifyToken, isAdmin], createClub);
  app.get("/admin/club", [verifyToken, isAdmin], getClubs);
}
