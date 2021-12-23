import {Express} from "express-serve-static-core";
import {getUsers, updateUser, updateUsersRole} from "../controllers/users.controller";
import verifyToken from "../middlewares/authJwt";

export default function UsersRoutes(app: Express) {
  app.put("/users/role", [verifyToken], updateUsersRole);
  app.get("/users", [verifyToken], getUsers);
  app.put("/user", [verifyToken], updateUser);
}
