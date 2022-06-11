import crypto from "crypto";
import Translation from "../models/translation.model";
import User from "../models/user.model";
import { requestHandler, requestHandlerError } from "../utils/requestHandler";
import FreestyleDataElement from "../models/freestyleDataElement.model";
import mongoose, { Query } from "mongoose";
import FreestyleDataGroup from "../models/freestyleDataGroup.model";
import Club from "../models/club.model";
import { LANGUAGES } from "../consts/lang";
import TranslationMissing from "../models/translationMissing.model";

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
    TranslationMissing.deleteMany({ key: req.body.key.trim() }).then(() => {
      return requestHandler(
        res,
        200,
        "success.create.localization",
        "Successfully created localization!"
      );
    });
  });
}
export const getMissingLocales = (req, res) => {
  TranslationMissing.find({})
    .select("-_id -__v")
    .exec((err, data) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", data);
    });
};

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
export function getTranslation(req, res) {
  const key = req.params.key;
  const namespace = req.params.namespace;
  Translation.find({ key, namespace })
    .select("-__v -key -namespace")
    .exec((err, data) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      const tmp = {};
      LANGUAGES.map((lang) => {
        const d = data.find(
          (t) => t.language.toLowerCase() === lang.toLowerCase()
        );
        if (d) {
          tmp[lang] = { id: d._id, translation: d.translation };
        }
      });
      return requestHandler(res, 200, "", "", tmp);
    });
}
export function updateTranslation(req, res) {
  const ids = req.body.ids;
  const data = req.body.data;
  if (ids.includes("create")) {
    const t = new Translation({
      language: data.language,
      namespace: data.namespace,
      translation: data.translation,
      key: data.key,
    });
    return t.save((err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "");
    });
  }
  if (data.translation === "") {
    return Translation.deleteMany({
      _id: { $in: ids.map((i) => new mongoose.Types.ObjectId(i)) },
    }).exec((err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "");
    });
  }
  return Translation.updateMany(
    { _id: { $in: ids.map((i) => new mongoose.Types.ObjectId(i)) } },
    data
  ).exec((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(res, 200, "", "");
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
  FreestyleDataElement.updateOne(
    { _id: req.body.id },
    { level: req.body.level }
  ).exec((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.update.freestyle.level",
      "Successfully update Freestyle Level!"
    );
  });
}
export function updateFreestyleElementKey(req, res) {
  FreestyleDataElement.updateOne(
    { _id: req.body.id },
    { key: req.body.key }
  ).exec((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.update.freestyle.key",
      "Successfully update Freestyle Key!"
    );
  });
}
export function updateFreestyleElementGroups(req, res) {
  const { groups, id } = req.body;
  FreestyleDataGroup.find({ key: { $in: groups } }).then((groupsData) => {
    FreestyleDataElement.updateOne(
      { _id: id },
      {
        groups: groupsData.map((g) => g._id),
      }
    ).exec((err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(
        res,
        200,
        "success.update.groups",
        "Successfully updated Groups!"
      );
    });
  });
}
export function createFreestyleGroup(req, res) {
  const { key, parent } = req.body;
  if (parent === "") {
    const fs = new FreestyleDataGroup({
      key,
    });
    fs.save((err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(
        res,
        200,
        "success.create.freestyle.group",
        "Successfully created freestyle Group!"
      );
    });
  } else {
    FreestyleDataGroup.findOne({ key: parent }).then((parentData) => {
      const fs = new FreestyleDataGroup({
        key,
        parent: parentData._id,
      });
      fs.save((err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.create.freestyle.group",
          "Successfully created freestyle Group!"
        );
      });
    });
  }
}
export function deleteFreestyleGroup(req, res) {
  const { key } = req.body;
  FreestyleDataGroup.deleteOne({ key }).exec((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.delete.freestyle.group",
      "Successfully deleted freestyle Group!"
    );
  });
}

export const getVersion = (req, res) => {
  return res.send({ v: process.env.npm_package_version });
};

export const createClub = (req, res) => {
  const { name, country, state, city, logo } = req.body;
  const fs = new Club({
    name,
    country,
    state,
    city,
    logo,
    coaches: [new mongoose.Types.ObjectId(req.userId)],
    athletes: [new mongoose.Types.ObjectId(req.userId)],
    admins: [new mongoose.Types.ObjectId(req.userId)],
  });
  fs.save((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.create.club",
      "Successfully created Club!"
    );
  });
};

export const getClubs = (req, res) => {
  const page = req.query.page - 1 || 0;
  const limit = req.query.limit || 5;
  Club.find({})
    .limit(limit)
    .skip(page * limit)
    .exec((err, clubs) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      Club.countDocuments().exec((err, items) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(res, 200, "", "", {
          items,
          clubs,
          page,
          pages: Math.ceil(items / limit),
          count: clubs.length,
        });
      });
    });
};
