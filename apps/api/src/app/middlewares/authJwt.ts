import jwt from "jsonwebtoken";
import config from "../config/auth.config";

const {TokenExpiredError} = jwt;

const catchError = (err: any, res: any) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({
      message: {
        text: "Access Token expired",
        key: "unauthorized.accesstoken",
      },
    });
  }

  return res.sendStatus(401).send({
    message: {
      text: "Unauthorized",
      key: "unauthorized",
    },
  });
};

export default function verifyToken(req: any, res: any, next: any) {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send({
      message: {
        text: "No token provided",
        key: "unauthorized.accesstoken.not",
      },
    });
  }

  // @ts-ignore
  jwt.verify(token, config.secret, {}, (err: any, decoded: any) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded?.id;
    next();
  });
};