export function bodyCheckNull(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .send({ message: { text: 'Missing Body', key: 'missing.body' } });
  }
  next();
}

export function bodyCheckNullUsername(req, res, next) {
  if (!req.body.username || req.body.username === '') {
    return res.status(400).send({
      message: {
        text: 'Missing Field Username',
        key: 'missing.field.username',
      },
    });
  }
  next();
}

export function bodyCheckNullFirstname(req, res, next) {
  if (!req.body.firstname || req.body.firstname === '') {
    return res.status(400).send({
      message: {
        text: 'Missing Field Firstname',
        key: 'missing.field.firstname',
      },
    });
  }
  next();
}

export function bodyCheckNullLastname(req, res, next) {
  if (!req.body.lastname || req.body.lastname === '') {
    return res.status(400).send({
      message: {
        text: 'Missing Field Lastname',
        key: 'missing.field.lastname',
      },
    });
  }
  next();
}

export function bodyCheckNullEmail(req, res, next) {
  if (!req.body.email || req.body.email === '') {
    return res.status(400).send({
      message: {
        text: 'Missing Field Email',
        key: 'missing.field.email',
      },
    });
  }
  next();
}

export function bodyCheckNullPassword(req, res, next) {
  if (!req.body.password || req.body.password === '') {
    return res.status(400).send({
      message: {
        text: 'Missing Field Password',
        key: 'missing.field.password',
      },
    });
  }
  next();
}
