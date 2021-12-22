import bcrypt from 'bcryptjs';
import Role from '../models/role.model';
import User from '../models/user.model';

export const updateUsersRole = (req: any, res: any) => {
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
    User.updateOne({ _id: req.userId }, { roles: roles }, (err: any) => {
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

export const getUsers = (req: any, res: any) => {
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

export const updateUser = (req: any, res: any) => {
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
          { email: req.body.email.toLowerCase() }
        ).exec((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
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
            const roles = userNew.roles.map((role: any) => role.name);
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
