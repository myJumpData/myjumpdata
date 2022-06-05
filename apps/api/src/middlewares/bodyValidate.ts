import { requestHandler } from "../utils/requestHandler";

export function bodyValidateUsername(req, res, next) {
  if (!req.body.username) {
    return next();
  }
  if (req.body.username.length < 4) {
    return requestHandler(
      res,
      400,
      "notenoughcharacter.field.username",
      "Not enough character Field Username"
    );
  }
  if (!req.body.username.match(/^[A-Z\d._-]+$/i)) {
    return requestHandler(
      res,
      400,
      "notallowedcharacter.field.username",
      "Not allowed character Field Username"
    );
  }
  return next();
}

export function bodyValidateFirstname(req, res, next) {
  if (!req.body.firstname) {
    return next();
  }
  if (!req.body.firstname.match(/^[A-Z-]+$/i)) {
    return requestHandler(
      res,
      400,
      "notallowedcharacter.field.firstname",
      "Not allowed character Field Firstname"
    );
  }
  return next();
}

export function bodyValidateLastname(req, res, next) {
  if (!req.body.lastname) {
    return next();
  }
  if (!req.body.lastname.match(/^[A-Z-]+$/i)) {
    return requestHandler(
      res,
      400,
      "notallowedcharacter.field.lastname",
      "Not allowed character Field Lastname"
    );
  }
  return next();
}

export function bodyValidateEmail(req, res, next) {
  if (!req.body.email) {
    return next();
  }
  if (!req.body.email.match(/^\w+([.-]?\w+)*@\w+([.]?\w+)*(\.\w{2,3})+$/i)) {
    return requestHandler(
      res,
      400,
      "notallowedcharacter.field.email",
      "Not allowed character Field Email"
    );
  }
  return next();
}

export function bodyValidatePassword(req, res, next) {
  if (!req.body.password) {
    return next();
  }
  if (req.body.password.length < 4) {
    return requestHandler(
      res,
      400,
      "notenoughcharacter.field.password",
      "Not enough character Field password"
    );
  }
  return next();
}
