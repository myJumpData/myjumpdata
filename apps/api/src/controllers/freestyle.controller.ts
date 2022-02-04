import mongoose from "mongoose";
import FreestyleDataElement from "../models/freestyleDataElement.model";
import FreestyleDataGroup from "../models/freestyleDataGroup.model";
import FreestyleDataUser from "../models/freestyleDataUser.model";
import { requestHandler, requestHandlerError } from "../requestHandler";

export function getFreestyle(req, res) {
  let count = 0;
  const path = req.params.path;
  let pathSplit = [""];
  if (path) {
    pathSplit = path.split("_").filter((e: string) => e);
  }
  process(pathSplit[0], pathSplit[0]);
  async function process(key, name) {
    let id = null;
    if (key) {
      const findGroupCurrent = await FreestyleDataGroup.findOne({
        key: name,
      }).exec();
      if (findGroupCurrent) {
        id = findGroupCurrent._id;
      }
    }
    const findGroupChilds = await FreestyleDataGroup.find({
      parent: id,
    })
      //.sort("level key")
      .exec();
    const findGroupElements = await FreestyleDataElement.find({
      groups: { $in: id },
    })
      //.sort("level key")
      .exec();
    count = count + 1;
    if (pathSplit.length > count) {
      return process(pathSplit[count], name + "_" + pathSplit[count]);
    } else {
      const groups = findGroupChilds.map((e) => {
        return { key: e.key, group: true };
      });
      const elements = findGroupElements.map((e) => {
        return {
          id: e._id,
          key: e.key,
          level: e.level,
          element: true,
          compiled: e.compiled,
        };
      });
      if (key === "") {
        return requestHandler(res, 200, "", "", [...groups, ...elements]);
      } else {
        return requestHandler(res, 200, "", "", [
          { key: pathSplit.slice(0, -1).join("_"), back: true },
          ...groups,
          ...elements,
        ]);
      }
    }
  }
}
export function getFreestyleDataOwn(req, res) {
  FreestyleDataUser.find({ user: req.userId })
    .select("-createdAt -updatedAt -_id -__v")
    .exec((err, data) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", data);
    });
}
export function saveFreestyleDataOwn(req, res) {
  FreestyleDataUser.find({ user: req.userId, element: req.body.element }).exec(
    (err, response) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (response.length > 0) {
        FreestyleDataUser.findOneAndUpdate(
          {
            user: req.userId,
            element: req.body.element,
          },
          { stateUser: req.body.state }
        ).exec((err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          return requestHandler(
            res,
            200,
            "success.save.freestyle.own",
            "Successfully saved freestyle own!"
          );
        });
      } else {
        const freestyleData = new FreestyleDataUser({
          user: new mongoose.Types.ObjectId(req.userId),
          element: new mongoose.Types.ObjectId(req.body.element),
          stateUser: req.body.state,
        });

        freestyleData.save((err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          return requestHandler(
            res,
            200,
            "success.save.freestyle.own",
            "Successfully saved freestyle own!"
          );
        });
      }
    }
  );
}

export function getFreestyleData(req, res) {
  FreestyleDataUser.find({ user: req.params.id })
    .select("-createdAt -updatedAt -_id -__v")
    .exec((err, data) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", data);
    });
}
export function saveFreestyleData(req, res) {
  FreestyleDataUser.find({
    user: req.params.id,
    element: req.body.element,
  }).exec((err, response) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    if (response.length > 0) {
      FreestyleDataUser.findOneAndUpdate(
        {
          user: req.params.id,
          element: req.body.element,
        },
        { stateCoach: req.body.state }
      ).exec((err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.save.freestyle.group",
          "Successfully saved freestyle group!"
        );
      });
    } else {
      const freestyleData = new FreestyleDataUser({
        user: new mongoose.Types.ObjectId(req.params.id),
        element: new mongoose.Types.ObjectId(req.body.element),
        stateCoach: req.body.state,
      });

      freestyleData.save((err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.save.freestyle.group",
          "Successfully saved freestyle group!"
        );
      });
    }
  });
}
