import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/auth.config";
import hostConfig from "../config/host.config";
import SendMail from "../helper/email";
import responseHandler, {
  responseHandlerError,
} from "../helper/responseHandler";
import Role from "../models/role.model";
import User from "../models/user.model";

export const updateUsersRole = (req, res) => {
  if (!req.body.roles) {
    return res
      .status(400)
      .send({ message: { text: "No Roles selected" }, body: req.body });
  }
  Role.find({ name: req.body.roles }, (err, roles) => {
    if (err) {
      return responseHandlerError(res, err);
    }
    User.updateOne({ _id: req.userId }, { roles: roles }, (err) => {
      if (err) {
        return responseHandlerError(res, err);
      }
      return responseHandler(
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
    return responseHandler(res, 200, "", "", []);
  }
  console.log(req.params.search);
  if (!req.params.search.match(/^[A-Z0-9._-]+$/i)) {
    return responseHandler(res, 200, "", "", []);
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
        return responseHandlerError(res, err);
      }
      return responseHandler(res, 200, "", "", users);
    });
};

export const updateUser = (req, res) => {
  User.findOne({ _id: req.userId })
    .select("-password -__v")
    .exec((err, user) => {
      if (err) {
        return responseHandlerError(res, err);
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
                return responseHandlerError(res, err);
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
            return responseHandlerError(res, err);
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
            return responseHandlerError(res, err);
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
            return responseHandlerError(res, err);
          }
          const token = jwt.sign(
            { id: user.id, email: req.body.email, timestamp: Date.now() },
            config.secret
          );
          const url = `${hostConfig.URL}/verify/${token}`;
          SendMail({
            to: user.email,
            subject: "Please Confirm your E-Mail-Adress",
            html: `<a href="${url}">${url}</a>`,
          }).catch((err) => {
            return responseHandlerError(res, err);
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
            return responseHandlerError(res, err);
          }
          updatedList.push("Password");
        });
      }
      if (req.body.picture) {
        User.updateOne({ _id: req.userId }, { picture: req.body.picture }).exec(
          (err) => {
            if (err) {
              return responseHandlerError(res, err);
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
              return responseHandlerError(res, err);
            }
            let email = "";
            if (req.userId === userNew.id) {
              email = userNew.email;
            }
            const roles = userNew.roles.map((role) => role.name);
            return responseHandler(
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
