import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Query } from 'mongoose';
import config from '../config/auth.config';
import Role from '../models/role.model';
import ScoreDataRecord from '../models/scoreDataRecord.model';
import ScoreDataRecordOwn from '../models/scoreDataRecordOwn.model';
import ScoreDataType from '../models/scoreDataType.model';
import User from '../models/user.model';

export function signup(req, res) {
  // Initiate Variables
  const { username, firstname, lastname, email, password } = req.body;

  // Check if username already taken
  User.find({
    username: username,
  }).exec((err, user_username_check) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    if (user_username_check.length > 0) {
      return res.status(409).send({
        message: {
          text: 'Duplicate Field Username',
          key: 'duplicate.field.username',
        },
      });
    }

    // Create user
    const user = new User({
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: bcrypt.hashSync(password, 8),
    });

    user.save((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      // Add Roles
      Role.find({
        name: { $in: ['athlete'] },
      }).exec((err, roles) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        user.roles = roles.map((role) => role._id);
        user.save((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          return res.status(201).send({
            message: {
              text: 'Successfully created user',
              key: 'success.user.created',
            },
          });
        });
      });
    });
  });
}

export function signin(req, res) {
  // Initiate Variables
  const { username, password } = req.body;

  // Login
  User.findOne({
    username: {
      $regex: new RegExp(`^${username}`, 'i'),
    },
  })
    .populate('roles', '-__v')
    .exec(async (err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({
          message: {
            text: 'User not found',
            key: 'notfound.field.username',
          },
        });
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({
          message: {
            text: 'Wrong password',
            key: 'wrong.field.password',
          },
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      const roles = user.roles.map((role) => role.name);

      res.status(200).send({
        message: {
          text: 'Successfully logged in',
          key: 'success.user.login',
        },
        user: {
          id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          roles: roles,
          token: token,
        },
      });
    });
}

export async function getUser(req, res) {
  const search = req.params.search;

  const request = await User.findOne({ username: search })
    .select('-password -__v')
    .populate('roles', '-__v -_id');
  if (request === null) {
    return res.status(404).send({
      message: { text: 'User not Found', key: 'error.notfound.user' },
    });
  }

  const scoreDataTypesList = await ScoreDataType.find({});
  const jobQueries: Query<object, object>[] = [];
  scoreDataTypesList.forEach((type) => {
    jobQueries.push(
      ScoreDataRecordOwn.findOne({
        user: request.id,
        type: type.id,
      })
        .select('-_id -user -__v -createdAt -updatedAt')
        .sort('-score')
        .populate('type', '-__v -_id'),
      ScoreDataRecord.findOne({
        user: request.id,
        type: type.id,
      })
        .select('-_id -user -__v -createdAt -updatedAt')
        .sort('-score')
        .populate('type', '-__v -_id')
    );
  });
  const highdata = Promise.all(jobQueries).then((d) => {
    const tmp: { scoreOwn: number; score: number; type: string }[] = [];
    scoreDataTypesList.map((item) => {
      if (item) {
        tmp.push({ type: item.name, score: 0, scoreOwn: 0 });
      }
    });
    d.forEach((i: any) => {
      if (i !== null) {
        if (i.coach === undefined) {
          const index = tmp.findIndex((e) => e.type === i.type.name);
          tmp[index].scoreOwn = i.score;
        } else {
          const index = tmp.findIndex((e) => e.type === i.type.name);
          tmp[index].score = i.score;
        }
      }
    });
    return tmp;
  });
  const roles = request.roles.map((role) => role.name);
  const picture = `https://secure.gravatar.com/avatar/${crypto
    .createHash('md5')
    .update(request.email)
    .digest('hex')}?size=300&d=404`;
  highdata.then((highdata) => {
    return res.status(200).send({
      message: { text: 'Successfully found User', key: 'success.user.found' },
      data: {
        id: request.id,
        username: request.username,
        firstname: request.firstname,
        lastname: request.lastname,
        roles,
        picture,
        highdata,
      },
    });
  });
}

export function deleteUser(req, res) {
  User.deleteOne({ _id: req.userId }).exec((err) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    return res.status(200).send({
      message: {
        text: 'Successfully deleted User',
        key: 'success.user.delete',
      },
    });
  });
}
