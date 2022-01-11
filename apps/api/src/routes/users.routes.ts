import { Express } from 'express-serve-static-core';
import {
  getUsers,
  updateUser,
  updateUsersRole,
} from '../controllers/users.controller';
import verifyToken from '../middlewares/authJwt';
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

export default function UsersRoutes(app: Express) {
  app.put('/users/role', [verifyToken], updateUsersRole);
  app.get('/users', [verifyToken], getUsers);
  app.put(
    '/user',
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
