export function bodyCheckNull(req: any, res: any, next: any) {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .send({message: {text: "Missing Body", key: "missing.body"}});
  }
  next();
}

export function bodyCheckNullUsername(req: any, res: any, next: any) {
  if (!req.body.username || req.body.username === "") {
    return res.status(400).send({
      message: {
        text: "Missing Field Username",
        key: "missing.field.username",
      },
    });
  }
  next();
}

export function bodyCheckNullFirstname(req: any, res: any, next: any) {
  if (!req.body.firstname || req.body.firstname === "") {
    return res.status(400).send({
      message: {
        text: "Missing Field Firstname",
        key: "missing.field.firstname",
      },
    });
  }
  next();
}

export function bodyCheckNullLastname(req: any, res: any, next: any) {
  if (!req.body.lastname || req.body.lastname === "") {
    return res.status(400).send({
      message: {
        text: "Missing Field Lastname",
        key: "missing.field.lastname",
      },
    });
  }
  next();
}

export function bodyCheckNullEmail(req: any, res: any, next: any) {
  if (!req.body.email || req.body.email === "") {
    return res.status(400).send({
      message: {
        text: "Missing Field Email",
        key: "missing.field.email",
      },
    });
  }
  next();
}

export function bodyCheckNullPassword(req: any, res: any, next: any) {
  if (!req.body.password || req.body.password === "") {
    return res.status(400).send({
      message: {
        text: "Missing Field Password",
        key: "missing.field.password",
      },
    });
  }
  next();
}
