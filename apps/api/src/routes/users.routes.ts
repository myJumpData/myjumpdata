import { Express } from "express-serve-static-core";
import {
  searchUsers,
  searchUsersAll,
  updateUser,
} from "../controllers/users.controller";
import verifyToken from "../middlewares/authJwt";
import {
  bodySanitizeEmail,
  bodySanitizeFirstname,
  bodySanitizeLastname,
  bodySanitizePassword,
  bodySanitizeUsername,
} from "../middlewares/bodySanitize";
import {
  bodyValidateEmail,
  bodyValidateFirstname,
  bodyValidateLastname,
  bodyValidatePassword,
  bodyValidateUsername,
} from "../middlewares/bodyValidate";

export default function UsersRoutes(app: Express) {
  app.get("/users/:search", [verifyToken], searchUsers);
  app.get("/users_all/:search", [verifyToken], searchUsersAll);
  app.post(
    "/user_edit",
    [
      verifyToken,

      bodySanitizeUsername,
      bodySanitizeFirstname,
      bodySanitizeLastname,
      bodySanitizeEmail,
      bodySanitizePassword,

      bodyValidateUsername,
      bodyValidateFirstname,
      bodyValidateLastname,
      bodyValidateEmail,
      bodyValidatePassword,
    ],
    updateUser
  );
}
