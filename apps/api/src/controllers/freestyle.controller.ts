import responseHandler from "../helper/responseHandler";
import FreestyleDataGroup from "../models/freestyleDataGroup";

export function getFreestyle(req, res) {
  let count = 0;
  /* const newData = new FreestyleDataGroup({
    key: 'footjumps_cross',
    path: '/',
    parent: '61c0a9a19fbb588485b04477',
  }); newData.save();*/
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
    count = count + 1;
    if (pathSplit.length > count) {
      return process(pathSplit[count]);
    } else {
      const groups = findGroupChilds.map((e) => {
        return { key: e.key, group: true };
      });
      if (parent_key === null) {
        return responseHandler(
          res,
          200,
          "success",
          "Success reading Freestyle",
          [...groups]
        );
      } else {
        return responseHandler(
          res,
          200,
          "success",
          "Success reading Freestyle",
          [{ key: parent_key, back: true }, ...groups]
        );
      }
    }
  }
}
