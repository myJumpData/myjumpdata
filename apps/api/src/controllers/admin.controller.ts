import Translation from "../models/translation.model";
import { requestHandler } from "../requestHandler";

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
