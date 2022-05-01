import crypto from "crypto";
import Translation from "../models/translation.model";
import User from "../models/user.model";
import { requestHandler, requestHandlerError } from "../requestHandler";

export function createLocalization(req, res) {
  if (!req.userRoles?.includes("admin")) {
    return requestHandler(
      res,
      401,
      "unauthorized.admin.not",
      "Need Admin Role"
    );
  }
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
  if (!req.userRoles?.includes("admin")) {
    return requestHandler(
      res,
      401,
      "unauthorized.admin.not",
      "Need Admin Role"
    );
  }
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
