import { APP_URL, JWT_SECRET } from "@myjumpdata/consts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SendMail from "../email";
import Role from "../models/role.model";
import User from "../models/user.model";
import { requestHandler, requestHandlerError } from "../requestHandler";

export const updateUsersRole = (req, res) => {
  if (!req.body.roles) {
    return res
      .status(400)
      .send({ message: { text: "No Roles selected" }, body: req.body });
  }
  Role.find({ name: req.body.roles }, (err, roles) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    User.updateOne({ _id: req.userId }, { roles: roles }, (err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(
        res,
        200,
        "success.updpdated.user.role",
        "User Roles have been updated successfully!"
      );
    });
  });
};

export const searchUsers = (req, res) => {
  if (
    req.params.search === "" ||
    req.params.search === null ||
    req.params.search === undefined
  ) {
    return requestHandler(res, 200, "", "", []);
  }
  console.log(req.params.search);
  if (!req.params.search.match(/^[A-Z0-9._-]+$/i)) {
    return requestHandler(res, 200, "", "", []);
  }
  User.find(
    {
      $text: { $search: req.params.search },
      _id: { $ne: req.userId },
      active: true,
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("roles")
    .select("-password")
    .limit(5)
    .exec((err, users) => {
      if (err) {
        console.log(err);
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", users);
    });
};

export const updateUser = (req, res) => {
  User.findOne({ _id: req.userId })
    .select("-password -__v")
    .exec((err, user) => {
      if (err) {
        return requestHandlerError(res, err);
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
                return requestHandlerError(res, err);
              }
              updatedList.push("Username");
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
            return requestHandlerError(res, err);
          }
          updatedList.push("Firstname");
        });
      }
      if (req.body.lastname && user.lastname !== req.body.lastname) {
        User.updateOne(
          { _id: req.userId },
          { lastname: req.body.lastname.toLowerCase() }
        ).exec((err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          updatedList.push("Lastname");
        });
      }
      if (req.body.email && user.email !== req.body.email) {
        User.updateOne(
          { _id: req.userId },
          { email: req.body.email.toLowerCase(), active: false }
        ).exec((err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          const token = jwt.sign(
            { id: user.id, email: req.body.email, timestamp: Date.now() },
            JWT_SECRET
          );
          const url = `${APP_URL}/verify/${token}`;
          SendMail({
            to: user.email,
            subject: "Please Confirm your E-Mail-Adress",
            html: `<a href="${url}">${url}</a>`,
          }).catch((err) => {
            return requestHandlerError(res, err);
          });
          updatedList.push("Email");
        });
      }
      if (req.body.password) {
        User.updateOne(
          { _id: req.userId },
          { password: bcrypt.hashSync(req.body.password) }
        ).exec((err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          updatedList.push("Password");
        });
      }
      if (req.body.picture) {
        User.updateOne({ _id: req.userId }, { picture: req.body.picture }).exec(
          (err) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            updatedList.push("Picture");
          }
        );
      }
      setTimeout(() => {
        User.findOne({ _id: req.userId })
          .select("-password -__v")
          .populate("roles")
          .exec((err, userNew) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            let email = "";
            if (req.userId === userNew.id) {
              email = userNew.email;
            }
            const roles = userNew.roles.map((role) => role.name);
            return requestHandler(
              res,
              200,
              "success.update.user",
              `Successfully Updated ${JSON.stringify(updatedList)} `,
              {
                username: userNew.username,
                firstname: userNew.firstname,
                lastname: userNew.lastname,
                roles,
                email,
                picture: userNew.picture,
              }
            );
          });
      }, 500);
    });
};
