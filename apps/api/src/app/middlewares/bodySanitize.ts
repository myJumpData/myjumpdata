export function bodySanitizeUsername(req: any, res: any, next: any) {
  req.body.username = req.body.username.trim().toLowerCase();
  next();
}

export function bodySanitizeFirstname(req: any, res: any, next: any) {
  req.body.firstname = req.body.firstname.trim().toLowerCase();
  next();
}

export function bodySanitizeLastname(req: any, res: any, next: any) {
  req.body.lastname = req.body.lastname.trim().toLowerCase();
  next();
}

export function bodySanitizeEmail(req: any, res: any, next: any) {
  req.body.email = req.body.email.trim().toLowerCase();
  next();
}

export function bodySanitizePassword(req: any, res: any, next: any) {
  req.body.password = req.body.password.trim();
  next();
}
