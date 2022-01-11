export function bodySanitizeUsername(req, res, next) {
  if (!req.body.username) {
    return next();
  }
  req.body.username = req.body.username.trim().toLowerCase();
  return next();
}

export function bodySanitizeFirstname(req, res, next) {
  if (!req.body.firstname) {
    return next();
  }
  req.body.firstname = req.body.firstname.trim().toLowerCase();
  return next();
}

export function bodySanitizeLastname(req, res, next) {
  if (!req.body.lastname) {
    return next();
  }
  req.body.lastname = req.body.lastname.trim().toLowerCase();
  return next();
}

export function bodySanitizeEmail(req, res, next) {
  if (!req.body.email) {
    return next();
  }
  req.body.email = req.body.email.trim().toLowerCase();
  return next();
}

export function bodySanitizePassword(req, res, next) {
  if (!req.body.password) {
    return next();
  }
  req.body.password = req.body.password.trim();
  return next();
}
