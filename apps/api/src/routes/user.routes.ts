import { Express } from 'express-serve-static-core';
import {
  deleteUser,
  getUser,
  signin,
  signup,
  verify,
} from '../controllers/user.controller';
import verifyToken from '../middlewares/authJwt';
import {
  bodyCheckNullEmail,
  bodyCheckNullFirstname,
  bodyCheckNullLastname,
  bodyCheckNullPassword,
  bodyCheckNullUsername,
} from '../middlewares/bodyCheck';
import {
  bodySanitizeEmail,
  bodySanitizeFirstname,
  bodySanitizeLastname,
  bodySanitizePassword,
  bodySanitizeUsername,
} from '../middlewares/bodySanitize';
import {
  bodyValidateEmail,
  bodyValidateFirstname,
  bodyValidateLastname,
  bodyValidatePassword,
  bodyValidateUsername,
} from '../middlewares/bodyValidate';

export default function UserRoutes(app: Express) {
  app.post(
    '/auth/signup',
    [
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
    '/auth/signin',
    [
      bodyCheckNullUsername,
      bodyCheckNullPassword,

      bodySanitizeUsername,
      bodySanitizePassword,

      bodyValidateUsername,
    ],
    signin
  );

  app.get('/verify/:token', verify);
  app.get('/user/:search', getUser);
  app.delete('/user', [verifyToken], deleteUser);
}
