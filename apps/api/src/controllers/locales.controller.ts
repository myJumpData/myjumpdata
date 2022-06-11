import Translation from "../models/translation.model";
import { requestHandler, requestHandlerError } from "../utils/requestHandler";
import TranslationMissing from "../models/translationMissing.model";

export const getLocales = (req, res) => {
  const lng = req.params.lng.split("+");
  const ns = req.params.ns.split("+");
  Translation.find({
    namespace: { $in: ns },
    language: { $in: lng },
    translation: { $ne: "" },
  }).exec((err, translations) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    const data = translations.reduce((acc, translation) => {
      if (!acc[translation.language]) {
        acc[translation.language] = {};
      }
      if (!acc[translation.language][translation.namespace]) {
        acc[translation.language][translation.namespace] = {};
      }
      acc[translation.language][translation.namespace][translation.key] =
        translation.translation;
      return acc;
    }, {});
    return res.status(200).send(data);
  });
};
export const addLocales = (req, res) => {
  Translation.find({
    namespace: req.body.ns,
    key: req.body.key,
  }).exec((_, d) => {
    if (d.length <= 0) {
      TranslationMissing.find({
        key: req.body.key,
        namespace: req.body.ns,
      }).exec((_, data) => {
        if (data.length <= 0) {
          const t = new TranslationMissing({
            key: req.body.key,
            namespace: req.body.ns,
          });
          t.save((t) => {
            console.log(t);
          });
          return res.status(200).send({});
        }
      });
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
