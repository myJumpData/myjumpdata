export function bodyValidateUsername(req, res, next) {
  if (!req.body.username.match(/^[A-Z0-9._]+$/i)) {
    return res.status(400).send({
      message: {
        text: 'Not allowed character Field Username',
        key: 'notallowedcharacter.field.username',
      },
    });
  }
  next();
}

export function bodyValidateFirstname(req, res, next) {
  if (!req.body.firstname.match(/^[A-Z]+$/i)) {
    return res.status(400).send({
      message: {
        text: 'Not allowed character Field Firstname',
        key: 'notallowedcharacter.field.firstname',
      },
    });
  }
  next();
}

export function bodyValidateLastname(req, res, next) {
  if (!req.body.lastname.match(/^[A-Z]+$/i)) {
    return res.status(400).send({
      message: {
        text: 'Not allowed character Field Lastname',
        key: 'notallowedcharacter.field.lastname',
      },
    });
  }
  next();
}

export function bodyValidateEmail(req, res, next) {
  if (!req.body.email.match(/^\w+([.-]?\w+)*@\w+([.]?\w+)*(\.\w{2,3})+$/i)) {
    return res.status(400).send({
      message: {
        text: 'Not allowed character Field Email',
        key: 'notallowedcharacter.field.email',
      },
    });
  }
  next();
}

export function bodyValidatePassword(req, res, next) {
  if (req.body.password.length < 8) {
    return res.status(400).send({
      message: {
        text: 'Not enough character Field password',
        key: 'notenoughcharacter.field.password',
      },
    });
  }
  next();
}
