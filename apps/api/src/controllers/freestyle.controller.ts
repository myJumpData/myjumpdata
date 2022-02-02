import mongoose from "mongoose";
import FreestyleDataElement from "../models/freestyleDataElement.model";
import FreestyleDataGroup from "../models/freestyleDataGroup.model";
import FreestyleDataUser from "../models/freestyleDataUser.model";
import { requestHandler, requestHandlerError } from "../requestHandler";

export function getFreestyle(req, res) {
  let count = 0;
  const path = req.params.path;
  const pathSplit = path.split("/").filter((e: string) => e);
  process(pathSplit[0]);
  async function process(key) {
    let id = null;
    let parent_key: string | null = null;
    if (key) {
      const findGroupCurrent = await FreestyleDataGroup.findOne({
        key: key,
      }).exec();
      id = findGroupCurrent._id;
      if (findGroupCurrent.parent) {
        const findGroupParent = await FreestyleDataGroup.findOne({
          id: findGroupCurrent.parent,
        }).exec();
        parent_key = findGroupParent.key;
      } else {
        parent_key = "";
      }
    }
    const findGroupChilds = await FreestyleDataGroup.find({
      parent: id,
    });
    const findGroupElements = await FreestyleDataElement.find({
      groups: { $in: id },
    });
    count = count + 1;
    if (pathSplit.length > count) {
      return process(pathSplit[count]);
    } else {
      const groups = findGroupChilds.map((e) => {
        return { key: e.key, group: true };
      });
      const elements = findGroupElements.map((e) => {
        return { id: e._id, key: e.key, level: e.level, element: true };
      });
      if (parent_key === null) {
        return requestHandler(res, 200, "", "", [...groups, ...elements]);
      } else {
        return requestHandler(res, 200, "", "", [
          { key: parent_key, back: true },
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
      if (response) {
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
