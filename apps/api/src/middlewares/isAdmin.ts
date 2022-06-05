import { requestHandler } from "../utils/requestHandler";

export function isAdmin(req, res, next) {
  if (!req.userRoles?.includes("admin")) {
    return requestHandler(
      res,
      401,
      "unauthorized.admin.not",
      "Need Admin Role"
    );
  }
  return next();
}
