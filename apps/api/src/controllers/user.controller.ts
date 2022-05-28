import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Query } from "mongoose";
import { JWT_EXPIRATION, JWT_SECRET } from "../consts/auth";
import { API_URL, APP_URL } from "../consts/host";
import SendMail from "../email";
import Group from "../models/group.model";
import Role from "../models/role.model";
import ScoreDataRecord from "../models/scoreDataRecord.model";
import ScoreDataRecordOwn from "../models/scoreDataRecordOwn.model";
import ScoreDataType from "../models/scoreDataType.model";
import User from "../models/user.model";
import { requestHandler, requestHandlerError } from "../requestHandler";
import readUserPicture from "../utils/readUserPicture";

export function signup(req, res) {
  // Initiate Variables
  const { username, firstname, lastname, email, password, checked } = req.body;

  if (checked === true) {
    // Check if username already taken
    User.find({
      username: username,
    }).exec((err, user_username_check) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (user_username_check.length > 0) {
        return requestHandler(
          res,
          409,
          "duplicate.field.username",
          "Duplicate Field Username"
        );
      }

      // Create user
      const user = new User({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: bcrypt.hashSync(password, 8),
        active: false,
        picture: false,
        checked: true,
        checkedDate: new Date(),
      });

      user.save((err, user) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        // Add Roles
        Role.find({
          name: { $in: ["athlete"] },
        }).exec((err, roles) => {
          if (err) {
            return requestHandlerError(res, err);
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              return requestHandlerError(res, err);
            }

            const token = jwt.sign(
              { id: user.id, email: user.email, timestamp: Date.now() },
              JWT_SECRET
            );
            const url = `${API_URL}/verify/${token}`;
            SendMail({
              to: user.email,
              subject: "Please Confirm your E-Mail-Adress",
              html: `<a href="${url}">${url}</a>`,
            })
              .then(() => {
                return requestHandler(
                  res,
                  201,
                  "success.create.user",
                  "Successfully created user. Please Confirm Email"
                );
              })
              .catch((err) => {
                return requestHandlerError(res, err);
              });
          });
        });
      });
    });
  } else {
    return requestHandler(res, 400, "notchecked.field.checked", "Not checked");
  }
}

export function signin(req, res) {
  // Initiate Variables
  const { username, password } = req.body;

  // Login
  User.findOne({
    username: {
      $regex: new RegExp(`^${username}$`, "i"),
    },
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        return requestHandlerError(res, err);
      }

      if (!user) {
        return requestHandler(
          res,
          404,
          "notfound.field.username",
          "User not found"
        );
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return requestHandler(
          res,
          400,
          "wrong.field.password",
          "Wrong password"
        );
      }

      if (user.active !== true) {
        const token = jwt.sign(
          { id: user.id, email: user.email, timestamp: Date.now() },
          JWT_SECRET
        );
        const url = `${API_URL}/verify/${token}`;
        SendMail({
          to: user.email,
          subject: "Please Confirm your E-Mail-Adress",
          html: `<a href="${url}">${url}</a>`,
        })
          .then(() => {
            return requestHandler(
              res,
              403,
              "wrong.field.active",
              "Not Active Account. Confirm your E-Mail"
            );
          })
          .catch((err) => {
            return requestHandlerError(res, err);
          });
      } else {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRATION,
        });

        const roles = user.roles.map((role) => role.name);

        return requestHandler(
          res,
          201,
          "success.login.user",
          "Successfully logged in",
          {
            id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            roles: roles,
            token: token,
            active: user.active,
            picture: user.picture,
            checked: user.checked,
          }
        );
      }
    });
}
export function verify(req, res) {
  const token = req.params.token;
  if (token.lenght < 1) {
    return requestHandler(
      res,
      400,
      "missing.field.token",
      "Missing Field Token"
    );
  }
  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    User.updateMany({ email: data.email }, { active: true }).exec((err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return res.redirect(`${APP_URL}/login`);
    });
  });
}

export async function getUser(req, res) {
  const search = req.params.search;

  const request = await User.findOne({ username: search })
    .select("-password -__v")
    .populate("roles", "-__v -_id");
  if (request === null) {
    return requestHandler(res, 404, "notfound.user", "User not Found");
  }

  const scoreDataTypesList = await ScoreDataType.find({}).sort("order");
  const jobQueries: Query<object, object>[] = [];
  scoreDataTypesList.forEach((type) => {
    jobQueries.push(
      ScoreDataRecordOwn.findOne({
        user: request.id,
        type: type.id,
      })
        .select("-_id -user -__v -createdAt -updatedAt")
        .sort("-score")
        .populate("type", "-__v -_id"),
      ScoreDataRecord.findOne({
        user: request.id,
        type: type.id,
      })
        .select("-_id -user -__v -createdAt -updatedAt")
        .sort("-score")
        .populate("type", "-__v -_id")
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
  highdata.then((highdata) => {
    return requestHandler(res, 200, "", "", {
      id: request.id,
      username: request.username,
      firstname: request.firstname,
      lastname: request.lastname,
      roles,
      picture: readUserPicture(request),
      highdata,
    });
  });
}

export function deleteUser(req, res) {
  Group.updateMany(
    {
      $or: [
        { coaches: { $in: req.userId } },
        { athletes: { $in: req.userId } },
      ],
    },
    {
      $pullAll: {
        coaches: [req.userId],
        athletes: [req.userId],
      },
    }
  ).exec((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Group.deleteMany({ coaches: [] }).exec((err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      ScoreDataRecordOwn.deleteMany({ user: req.userId }).exec((err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        ScoreDataRecord.deleteMany({ user: req.userId }).exec((err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          User.deleteOne({ _id: req.userId }).exec((err) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            return requestHandler(
              res,
              200,
              "success.user.delete",
              "Deleted User Successfully"
            );
          });
        });
      });
    });
  });
}
