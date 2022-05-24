import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../consts/auth";
import { APP_URL } from "../consts/host";
import SendMail from "../email";
import User from "../models/user.model";
import { requestHandler, requestHandlerError } from "../requestHandler";
import Club from "../models/club.model";

export const searchUsers = (req, res) => {
  if (
    req.params.search === "" ||
    req.params.search === null ||
    req.params.search === undefined
  ) {
    return requestHandler(res, 200, "", "", []);
  }
  if (!req.params.search.match(/^[A-Z0-9._-]+$/i)) {
    return requestHandler(res, 200, "", "", []);
  }

  Club.findOne({
    $or: [
      { coaches: { $in: req.userId } },
      { athletes: { $in: req.userId } },
      { admins: { $in: req.userId } },
    ],
  }).exec((err, club) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    User.find(
      {
        $text: { $search: req.params.search },
        $or: [{ _id: { $in: club.athletes } }, { _id: { $in: club.athletes } }],
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
          return requestHandlerError(res, err);
        }
        const response = users.map((user) => {
          if (user.picture === "gravatar") {
            user.picture = `https://secure.gravatar.com/avatar/${crypto
              .createHash("md5")
              .update(user.email)
              .digest("hex")}?size=300&d=404`;
          }
          return user;
        });
        return requestHandler(res, 200, "", "", response);
      });
  });
};
export const searchUsersAll = (req, res) => {
  if (
    req.params.search === "" ||
    req.params.search === null ||
    req.params.search === undefined
  ) {
    return requestHandler(res, 200, "", "", []);
  }
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
        return requestHandlerError(res, err);
      }
      const response = users.map((user) => {
        if (user.picture === "gravatar") {
          user.picture = `https://secure.gravatar.com/avatar/${crypto
            .createHash("md5")
            .update(user.email)
            .digest("hex")}?size=300&d=404`;
        }
        return user;
      });
      return requestHandler(res, 200, "", "", response);
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
      if (req.body.checked) {
        User.updateOne({ _id: req.userId }, { checked: req.body.checked }).exec(
          (err) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            updatedList.push("Checked");
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
                active: userNew.active,
                checked: userNew.checked,
              }
            );
          });
      }, 500);
    });
};
