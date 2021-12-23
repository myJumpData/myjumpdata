import {deleteUser, getUser, signin, signup} from "../controllers/user.controller";
import {
  bodyCheckNull,
  bodyCheckNullEmail,
  bodyCheckNullFirstname,
  bodyCheckNullLastname,
  bodyCheckNullPassword,
  bodyCheckNullUsername,
} from "../middlewares/bodyCheck";
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
import verifyToken from "../middlewares/authJwt";
import {Express} from "express-serve-static-core";

export default function UserRoutes(app: Express) {
  app.post(
    "/auth/signup",
    [
      bodyCheckNull,
      bodyCheckNullUsername,
      bodyCheckNullFirstname,
      bodyCheckNullLastname,
      bodyCheckNullEmail,
      bodyCheckNullPassword,

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
    signup
  );

  app.post(
    "/auth/signin",
    [
      bodyCheckNull,
      bodyCheckNullUsername,
      bodyCheckNullPassword,

      bodySanitizeUsername,
      bodySanitizePassword,

      bodyValidateUsername,
    ],
    signin
  );

  app.get("/user/:search", getUser)
  app.delete("/user", [verifyToken], deleteUser);
}
