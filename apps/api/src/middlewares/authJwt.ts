import { JWT_SECRET } from "@myjumpdata/consts";
import jwt from "jsonwebtoken";
import { requestHandler } from "../requestHandler";

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return requestHandler(
      res,
      401,
      "unauthorized.accesstoken",
      "Access Token expired"
    );
  }

  return requestHandler(res, 401, "unauthorized", "Unauthorized");
};

export default function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return requestHandler(
      res,
      401,
      "unauthorized.accesstoken.not",
      "No token provided"
    );
  }

  jwt.verify(token, JWT_SECRET, {}, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded?.id;
    next();
  });
}
