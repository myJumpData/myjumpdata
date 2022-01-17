import jwt from "jsonwebtoken";
import config from "../config/auth.config";
import responseHandler from "../helper/responseHandler";

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return responseHandler(
      res,
      401,
      "unauthorized.accesstoken",
      "Access Token expired"
    );
  }

  return responseHandler(res, 401, "unauthorized", "Unauthorized");
};

export default function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) {
    return responseHandler(
      res,
      401,
      "unauthorized.accesstoken.not",
      "No token provided"
    );
  }

  jwt.verify(token, config.secret, {}, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded?.id;
    next();
  });
}
