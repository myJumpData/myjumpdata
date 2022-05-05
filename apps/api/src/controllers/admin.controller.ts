import crypto from "crypto";
import Translation from "../models/translation.model";
import User from "../models/user.model";
import { requestHandler, requestHandlerError } from "../requestHandler";
import FreestyleDataElement from "../models/freestyleDataElement.model";
import mongoose, { Query } from "mongoose";
import FreestyleDataGroup from "../models/freestyleDataGroup.model";

export function createLocalization(req, res) {
  Translation.create(
    Object.entries(req.body.translations)
      .map(([language, translation]) => {
        if (translation === "") {
          return null;
        }

        return {
          key: req.body.key.trim(),
          namespace: req.body.namespace.trim(),
          language,
          translation,
        };
      })
      .filter((element) => {
        return element !== null;
      })
  ).then(() => {
    return requestHandler(
      res,
      200,
      "success.create.localization",
      "Successfully created localization!"
    );
  });
}

export function deleteLocalization(req, res) {
  Translation.deleteMany({
    key: req.body.key.trim(),
    namespace: req.body.namespace.trim(),
  }).then((r) => {
    return requestHandler(
      res,
      200,
      "success.delete.localization",
      `Successfully deleted ${r.deletedCount} localization!`
    );
  });
}
export const getUsers = (req, res) => {
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

export function deleteFreestyle(req, res) {
  const elementId = req.body.id;
  FreestyleDataElement.deleteOne({
    _id: new mongoose.Types.ObjectId(elementId),
  }).exec((r) => {
    return requestHandler(res, 200, "", "", r);
  });
}
export function getFreestyleElement(req, res) {
  const elementId = req.params.id;
  FreestyleDataElement.findOne({ _id: elementId })
    .select("-__v")
    .populate("groups", "-__v -parent")
    .exec((err, elementData) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (!elementData) {
        return requestHandler(
          res,
          404,
          "error.freestyle.notfound",
          "Freestyle Element not found"
        );
      }
      return requestHandler(res, 200, "", "", {
        id: elementData._id,
        key: elementData.key,
        compiled: elementData.compiled,
        level: elementData.level,
        groups: elementData.groups,
      });
    });
}
export function getFreestyleTranslation(req, res) {
  const key = req.params.key;
  const jobQueries: Query<object, object>[] = [];
  key.split("_").forEach((element) => {
    jobQueries.push(
      Translation.find({ key: element, namespace: "freestyle" }).select(
        "-_id -__v -namespace"
      )
    );
  });
  Promise.all(jobQueries).then((translationData) => {
    const translation = {};
    translationData.flat().forEach((item: any) => {
      if (translation[item.language]) {
        translation[item.language][item.key] = item.translation;
      } else {
        translation[item.language] = {};
        translation[item.language][item.key] = item.translation;
      }
    });
    return requestHandler(res, 200, "", "", translation);
  });
}
export function createFreestyle(req, res) {
  const { key, level, groups } = req.body;
  FreestyleDataGroup.find({ key: { $in: groups } }).then((groupsData) => {
    const fs = new FreestyleDataElement({
      key,
      level,
      groups: groupsData.map((g) => g._id),
    });
    fs.save((err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(
        res,
        200,
        "success.create.freestyle",
        "Successfully created freestyle!"
      );
    });
  });
}
export function updateFreestyleElementLevel(req, res) {
  if (!req.userRoles?.includes("admin")) {
    return requestHandler(
      res,
      401,
      "unauthorized.admin.not",
      "Need Admin Role"
    );
  }
  FreestyleDataElement.updateOne(
    { _id: req.body.id },
    { level: req.body.level }
  ).exec((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(res, 200, "", "");
  });
}

export const getVersion = (req, res) => {
  return res.send({ v: process.env.npm_package_version });
};
