import { APP_URL, JWT_SECRET } from "@myjumpdata/consts";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import SendMail from "../email";
import User from "../models/user.model";
import { requestHandler, requestHandlerError } from "../requestHandler";

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

export const getUsers = (req, res) => {
  if (!req.userRoles?.includes("admin")) {
    return requestHandler(
      res,
      401,
      "unauthorized.admin.not",
      "Need Admin Role"
    );
  }
  const page = req.query.page - 1 || 0;
  const limit = req.query.limit || 5;
  User.find({})
    .limit(limit)
    .skip(page * limit)
    .populate("roles")
    .exec((err, users) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      const data = users.map((user) => {
        const roles = user.roles.map((role) => role.name);
        let picture: null | string = null;
        if (user.picture === "gravatar") {
          picture = `https://secure.gravatar.com/avatar/${crypto
            .createHash("md5")
            .update(user.email)
            .digest("hex")}?size=300&d=404`;
        }
        return {
          id: user._id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          active: user.active,
          picture,
          roles,
        };
      });
      User.countDocuments().exec((err, items) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(res, 200, "", "", {
          items,
          data,
          page,
          pages: Math.ceil(items / limit),
          count: data.length,
        });
      });
    });
};
