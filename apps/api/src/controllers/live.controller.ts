import Live from "../models/live.model";
import { requestHandler, requestHandlerError } from "../utils/requestHandler";

export const getcounter = (req, res) => {
  Live.find({ key: { $in: req.body.map((e) => e.key) } })
    .select("-type -__v -code -count")
    .exec((err, data) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(
        res,
        200,
        "",
        "",
        data.map((e) => ({ id: e._id, key: e.key }))
      );
    });
};
export const createCounter = (req, res) => {
  Live.find({ key: req.body.key }).exec((err, data) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    if (data.length > 0) {
      return requestHandler(res, 409, "error.key.duplicate", "Duplicate Key");
    }
    const d = new Live({
      type: "counter",
      key: req.body.key,
      code: req.body.code,
      count: 0,
      expireAt: new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 7),
    });
    d.save(() => {
      return requestHandler(res, 200, "", "");
    });
  });
};
export const setCounter = (req, res) => {
  Live.findOneAndUpdate(
    { key: req.body.key, code: req.body.code },
    {
      count: req.body.count,
      expireAt: new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 7),
    }
  ).exec((err, data) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    if (!data) {
      return requestHandler(res, 404, "error.key.notfound", "Key not found");
    }
    return requestHandler(res, 200, "", "", req.body);
  });
};
