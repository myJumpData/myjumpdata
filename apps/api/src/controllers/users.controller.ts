import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/auth.config';
import hostConfig from '../config/host.config';
import SendMail from '../helper/email';
import Role from '../models/role.model';
import User from '../models/user.model';

export const updateUsersRole = (req, res) => {
  if (!req.body.roles) {
    return res
      .status(400)
      .send({ message: { text: 'No Roles selected' }, body: req.body });
  }
  Role.find({ name: req.body.roles }, (err, roles) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    User.updateOne({ _id: req.userId }, { roles: roles }, (err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({
        message: { text: 'User Roles have been updated successfully!' },
      });
      return;
    });
  });
};

export const getUsers = (req, res) => {
  User.find({ _id: { $ne: req.userId } })
    .populate('roles')
    .select('-password')
    .exec((err, users) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      res.send({ users });
    });
};

export const updateUser = (req, res) => {
  User.findOne({ _id: req.userId })
    .select('-password -__v')
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      const updatedList: string[] = [];
      if (req.body.username && user.username !== req.body.username) {
        User.findOne({ username: req.body.username }).exec((err, u) => {
          if (u === null || u == undefined) {
            User.updateOne(
              { _id: req.userId },
              { username: req.body.username.toLowerCase() }
            ).exec((err) => {
              if (err) {
                return res.status(500).send({ message: err });
              }
              updatedList.push('Username');
            });
          }
        });
      }
      if (req.body.firstname && user.firstname !== req.body.firstname) {
        User.updateOne(
          { _id: req.userId },
          { firstname: req.body.firstname.toLowerCase() }
        ).exec((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          updatedList.push('Firstname');
        });
      }
      if (req.body.lastname && user.lastname !== req.body.lastname) {
        User.updateOne(
          { _id: req.userId },
          { lastname: req.body.lastname.toLowerCase() }
        ).exec((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          updatedList.push('Lastname');
        });
      }
      if (req.body.email && user.email !== req.body.email) {
        User.updateOne(
          { _id: req.userId },
          { email: req.body.email.toLowerCase(), active: false }
        ).exec((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          const token = jwt.sign(
            { id: user.id, email: req.body.email, timestamp: Date.now() },
            config.secret
          );
          const url = `${hostConfig.URL}/verify/${token}`;
          SendMail({
            to: user.email,
            subject: 'Please Confirm your E-Mail-Adress',
            html: `<a href="${url}">${url}</a>`,
          }).catch((err) => {
            return res.status(500).send({ message: err });
          });
          updatedList.push('Email');
        });
      }
      if (req.body.password) {
        User.updateOne(
          { _id: req.userId },
          { password: bcrypt.hashSync(req.body.password) }
        ).exec((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          updatedList.push('Password');
        });
      }
      setTimeout(() => {
        User.findOne({ _id: req.userId })
          .select('-password -__v')
          .populate('roles')
          .exec((err, userNew) => {
            if (err) {
              return res.status(500).send({ message: err });
            }
            let email = '';
            if (req.userId === userNew.id) {
              email = userNew.email;
            }
            const roles = userNew.roles.map((role) => role.name);
            return res.send({
              message: `Successfully Updated ${JSON.stringify(updatedList)} `,
              user: {
                username: userNew.username,
                firstname: userNew.firstname,
                lastname: userNew.lastname,
                roles,
                email,
              },
            });
          });
      }, 500);
    });
};
