import { requestHandler } from "../utils/requestHandler";

export function bodyCheckNullUsername(req, res, next) {
  if (!req.body.username || req.body.username === "") {
    return requestHandler(
      res,
      400,
      "missing.field.username",
      "Missing Field Username"
    );
  }
  next();
}

export function bodyCheckNullFirstname(req, res, next) {
  if (!req.body.firstname || req.body.firstname === "") {
    return requestHandler(
      res,
      400,
      "missing.field.firstname",
      "Missing Field Firstname"
    );
  }
  next();
}

export function bodyCheckNullLastname(req, res, next) {
  if (!req.body.lastname || req.body.lastname === "") {
    return requestHandler(
      res,
      400,
      "missing.field.lastname",
      "Missing Field Lastname"
    );
  }
  next();
}

export function bodyCheckNullEmail(req, res, next) {
  if (!req.body.email || req.body.email === "") {
    return requestHandler(
      res,
      400,
      "missing.field.email",
      "Missing Field Email"
    );
  }
  next();
}

export function bodyCheckNullPassword(req, res, next) {
  if (!req.body.password || req.body.password === "") {
    return requestHandler(
      res,
      400,
      "missing.field.password",
      "Missing Field Password"
    );
  }
  next();
}

export function bodyCheckNullDate(req, res, next) {
  if (!req.body.date || req.body.date === "") {
    return requestHandler(res, 400, "missing.field.date", "Missing Field Date");
  }
  next();
}

export function bodyCheckNullType(req, res, next) {
  if (!req.body.type || req.body.type === "") {
    return requestHandler(res, 400, "missing.field.type", "Missing Field Type");
  }
  next();
}

export function bodyCheckNullScore(req, res, next) {
  if (!req.body.score || req.body.score === "") {
    return requestHandler(
      res,
      400,
      "missing.field.score",
      "Missing Field Score"
    );
  }
  next();
}

export function bodyCheckNullUser(req, res, next) {
  if (!req.body.user || req.body.user === "") {
    return requestHandler(res, 400, "missing.field.user", "Missing Field User");
  }
  next();
}
