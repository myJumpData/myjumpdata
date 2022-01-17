import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Query } from "mongoose";
import config from "../config/auth.config";
import hostConfig from "../config/host.config";
import SendMail from "../helper/email";
import responseHandler, {
  responseHandlerError,
} from "../helper/responseHandler";
import Role from "../models/role.model";
import ScoreDataRecord from "../models/scoreDataRecord.model";
import ScoreDataRecordOwn from "../models/scoreDataRecordOwn.model";
import ScoreDataType from "../models/scoreDataType.model";
import User from "../models/user.model";

export function signup(req, res) {
  // Initiate Variables
  const { username, firstname, lastname, email, password } = req.body;

  // Check if username already taken
  User.find({
    username: username,
  }).exec((err, user_username_check) => {
    if (err) {
      return responseHandlerError(res, err);
    }
    if (user_username_check.length > 0) {
      return responseHandler(
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
    });

    user.save((err, user) => {
      if (err) {
        return responseHandlerError(res, err);
      }
      // Add Roles
      Role.find({
        name: { $in: ["athlete"] },
      }).exec((err, roles) => {
        if (err) {
          return responseHandlerError(res, err);
        }

        user.roles = roles.map((role) => role._id);
        user.save((err) => {
          if (err) {
            return responseHandlerError(res, err);
          }

          const token = jwt.sign(
            { id: user.id, email: user.email, timestamp: Date.now() },
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
          return responseHandler(
            res,
            201,
            "success.create.user",
            "Successfully created user. Please Confirm Email"
          );
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
      $regex: new RegExp(`^${username}$`, "i"),
    },
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        return responseHandlerError(res, err);
      }

      if (!user) {
        return responseHandler(
          res,
          404,
          "notfound.field.username",
          "User not found"
        );
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return responseHandler(
          res,
          400,
          "wrong.field.password",
          "Wrong password"
        );
      }

      if (user.active !== true) {
        const token = jwt.sign(
          { id: user.id, email: user.email, timestamp: Date.now() },
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
        return responseHandler(
          res,
          403,
          "wrong.field.active",
          "Not Active Account. Confirm your E-Mail"
        );
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      const roles = user.roles.map((role) => role.name);

      return responseHandler(
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
        }
      );
    });
}
export function verify(req, res) {
  const token = req.params.token;
  if (token.lenght < 1) {
    return responseHandler(
      res,
      400,
      "missing.field.token",
      "Missing Field Token"
    );
  }
  jwt.verify(token, config.secret, (err, data) => {
    if (err) {
      return responseHandlerError(res, err);
    }
    User.updateMany({ email: data.email }, { active: true }).exec((err) => {
      if (err) {
        return responseHandlerError(res, err);
      }
      return res.redirect(`${hostConfig.APP}/login`);
    });
  });
}

export async function getUser(req, res) {
  const search = req.params.search;

  const request = await User.findOne({ username: search })
    .select("-password -__v")
    .populate("roles", "-__v -_id");
  if (request === null) {
    return responseHandler(res, 404, "notfound.user", "User not Found");
  }

  const scoreDataTypesList = await ScoreDataType.find({});
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
  let picture: null | string = null;
  if (request.picture === "gravatar") {
    picture = `https://secure.gravatar.com/avatar/${crypto
      .createHash("md5")
      .update(request.email)
      .digest("hex")}?size=300&d=404`;
  }
  highdata.then((highdata) => {
    return responseHandler(
      res,
      200,
      "success.read.user",
      "Sucess reading user!",
      {
        id: request.id,
        username: request.username,
        firstname: request.firstname,
        lastname: request.lastname,
        roles,
        picture,
        highdata,
      }
    );
  });
}

export function deleteUser(req, res) {
  User.deleteOne({ _id: req.userId }).exec((err) => {
    if (err) {
      return responseHandlerError(res, err);
    }
    return responseHandler(
      res,
      200,
      "success.user.delete",
      "Deleted User Successfully"
    );
  });
}
