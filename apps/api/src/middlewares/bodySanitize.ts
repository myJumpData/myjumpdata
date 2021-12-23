export function bodySanitizeUsername(req, res, next) {
  req.body.username = req.body.username.trim().toLowerCase();
  next();
}

export function bodySanitizeFirstname(req, res, next) {
  req.body.firstname = req.body.firstname.trim().toLowerCase();
  next();
}

export function bodySanitizeLastname(req, res, next) {
  req.body.lastname = req.body.lastname.trim().toLowerCase();
  next();
}

export function bodySanitizeEmail(req, res, next) {
  req.body.email = req.body.email.trim().toLowerCase();
  next();
}

export function bodySanitizePassword(req, res, next) {
  req.body.password = req.body.password.trim();
  next();
}
