import Translation from "../models/translation.model";
import { requestHandler, requestHandlerError } from "../requestHandler";

export const getLocales = (req, res) => {
  const lng = req.params.lng;
  const ns = req.params.ns;
  Translation.find({ language: lng, namespace: ns })
    .select("-_id -__v -language -namespace")
    .exec((err, translation_data) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (translation_data.length > 0) {
        const map_data = {};
        translation_data.forEach(
          ({ key, translation }: { key: string; translation: string }) => {
            return (map_data[key] = translation);
          }
        );
        return res.status(200).send(map_data);
      }
    });
};
export const getTranslations = (req, res) => {
  if (!req.userRoles?.includes("admin")) {
    return requestHandler(
      res,
      401,
      "unauthorized.admin.not",
      "Need Admin Role"
    );
  }
  const namespace = req.query.namespace;
  Translation.find({ namespace: namespace })
    .select("-__v -namespace")
    .exec((err, translation_data) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      const data = {};
      translation_data.forEach(
        ({
          _id,
          key,
          language,
          translation,
        }: {
          _id: string;
          key: string;
          language: string;
          translation: string;
        }) => {
          if (!data[key]) {
            data[key] = {};
          }
          data[key]._id = _id;
          data[key][language] = translation;
        }
      );
      Translation.countDocuments({ namespace: namespace }).exec(
        (err, items) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          return requestHandler(res, 200, "", "", {
            items,
            data,
          });
        }
      );
    });
};