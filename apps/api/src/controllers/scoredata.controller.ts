import crypto from "crypto";
import mongoose, { Query } from "mongoose";
import Group from "../models/group.model";
import ScoreDataRecord from "../models/scoreDataRecord.model";
import ScoreDataRecordOwn from "../models/scoreDataRecordOwn.model";
import ScoreDataType from "../models/scoreDataType.model";
import { requestHandler, requestHandlerError } from "../utils/requestHandler";
import ScoreDataTypeTeam from "../models/scoreDataTypeTeam";
import ScoreDataRecordTeam from "../models/scoreDataRecordTeam.model";

export function saveScoreData(req, res) {
  const scoreData = new ScoreDataRecord({
    user: new mongoose.Types.ObjectId(req.body.user),
    score: req.body.score,
    coach: new mongoose.Types.ObjectId(req.userId),
    type: new mongoose.Types.ObjectId(req.body.type),
    createdAt: req.body.date,
  });

  scoreData.save((err, scoredata) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.save.scoredata",
      "Successfully saved scoredata!",
      scoredata
    );
  });
}

export function getScoreDataTypes(req, res) {
  ScoreDataType.find({})
    .sort("order")
    .exec((err, scoreDataTypes) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", scoreDataTypes);
    });
}

export function getScoreDataTypesTeam(req, res) {
  ScoreDataTypeTeam.find({})
    .sort("order")
    .exec((err, scoreDataTypesTeam) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", scoreDataTypesTeam);
    });
}

export function getScoreDataHigh(req, res) {
  const id = req.params.id;
  const type = req.params.type;
  Group.findOne({ _id: id }, { coaches: 0 })
    .populate("athletes", "-password -roles")
    .exec((err, group) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (!group) {
        return requestHandler(res, 404, "notfound.group", "Can't find group!");
      }
      const athletes = group.athletes.map((athlete) => athlete._id);
      ScoreDataRecord.find(
        {
          user: { $in: athletes },
          type: type,
        },
        {
          createdAt: 0,
          updatedAt: 0,
          coach: 0,
        }
      )
        .sort("user -score -type")
        .populate("user", "-password -roles")
        .exec((err, records) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          const response: { user: any; score: number }[] = [];
          records.forEach((item) => {
            if (!response.some((response) => response.user === item.user)) {
              let picture: null | string = null;
              if (item.user.picture === "gravatar") {
                picture = `https://secure.gravatar.com/avatar/${crypto
                  .createHash("md5")
                  .update(item.user.email)
                  .digest("hex")}?size=300&d=404`;
              }
              item.user.picture = picture;
              response.push(item as any);
            }
          });
          group.athletes.forEach(
            (item: {
              username: string;
              _id: string;
              firstname: string;
              email: string;
              lastname: string;
              active: boolean;
              picture: any;
            }) => {
              if (
                !response.some(
                  (response) => response.user.username === item.username
                )
              ) {
                let picture: null | string = null;
                if (item.picture === "gravatar" && item.email) {
                  picture = `https://secure.gravatar.com/avatar/${crypto
                    .createHash("md5")
                    .update(item.email)
                    .digest("hex")}?size=300&d=404`;
                }
                item.picture = picture;
                response.push({ user: item, score: 0 });
              }
            }
          );

          function compare(
            a: { user: { username: string } },
            b: { user: { username: string } }
          ) {
            const A = a.user.username.toUpperCase();
            const B = b.user.username.toUpperCase();
            if (A > B) {
              return 1;
            } else if (A < B) {
              return -1;
            } else {
              return 0;
            }
          }

          response.sort(compare);
          const highs = response.map((score) => {
            return score.score;
          });
          const high = Math.max(...highs);

          return requestHandler(res, 200, "", "", {
            high: high,
            scores: response,
          });
        });
    });
}

export function getScoreDataOwn(req, res) {
  ScoreDataType.find({})
    .sort("order")
    .then((scoreDataTypesList) => {
      const jobQueries: Query<object, object>[] = [];
      scoreDataTypesList.forEach((type) => {
        jobQueries.push(
          ScoreDataRecordOwn.findOne({ user: req.userId, type: type._id })
            .sort("-score")
            .populate("type", "-__v")
        );
      });
      return Promise.all(jobQueries);
    })
    .then((data) => {
      ScoreDataType.find({})
        .sort("order")
        .exec((err, scoreDataTypes) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          const response: any[] = [];
          scoreDataTypes.forEach((item) => {
            if (data.some((r: any) => r?.type.name === item.name)) {
              response.push(
                data.find((value: any) => value?.type.name === item.name)
              );
            } else {
              response.push({ type: item, score: 0 });
            }
          });
          return requestHandler(res, 200, "", "", response);
        });
    })
    .catch((err) => {
      return requestHandlerError(res, err);
    });
}

export function saveScoreDataOwn(req, res) {
  const scoreDataOwn = new ScoreDataRecordOwn({
    user: new mongoose.Types.ObjectId(req.userId),
    score: req.body.score,
    type: new mongoose.Types.ObjectId(req.body.type),
    createdAt: req.body.date,
  });

  scoreDataOwn.save((err, scoredata) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.save.scoredata.own",
      "Successfully saved scoredata own!",
      scoredata
    );
  });
}

export function resetScoreDataOwn(req, res) {
  ScoreDataRecordOwn.deleteMany({
    user: req.userId,
    type: req.body.type,
    score: { $gte: req.body.score },
  }).exec((err, data) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(res, 200, "", "", data);
  });
}

export function resetScoreData(req, res) {
  ScoreDataRecord.deleteMany({
    user: req.body.user,
    type: req.body.type,
    score: { $gte: req.body.score },
  }).exec((err, data) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(res, 200, "", "", data);
  });
}

export function saveScoreDataTeam(req, res) {
  const scoreData = new ScoreDataRecordTeam({
    team: new mongoose.Types.ObjectId(req.params.id),
    score: req.body.score,
    type: new mongoose.Types.ObjectId(req.body.type),
    createdAt: req.body.date,
  });

  scoreData.save((err, scoredata) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.save.scoredata",
      "Successfully saved scoredata!",
      scoredata
    );
  });
}

export function getScoreDataHighTeam(req, res) {
  ScoreDataTypeTeam.find({ team: new mongoose.Types.ObjectId(req.params.id) })
    .sort("order")
    .then((scoreDataTypesList) => {
      const jobQueries: Query<object, object>[] = [];
      scoreDataTypesList.forEach((type) => {
        jobQueries.push(
          ScoreDataRecordTeam.findOne({
            team: new mongoose.Types.ObjectId(req.params.id),
            type: type._id,
          })
            .sort("-score")
            .populate("type", "-__v")
        );
      });
      return Promise.all(jobQueries);
    })
    .then((data) => {
      ScoreDataTypeTeam.find({})
        .sort("order")
        .exec((err, scoreDataTypes) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          const response: any[] = [];
          scoreDataTypes.forEach((item) => {
            if (data.some((r: any) => r?.type.name === item.name)) {
              response.push(
                data.find((value: any) => value?.type.name === item.name)
              );
            } else {
              response.push({ type: item, score: 0 });
            }
          });
          return requestHandler(res, 200, "", "", response);
        });
    })
    .catch((err) => {
      return requestHandlerError(res, err);
    });
}

export function resetScoreDataTeam(req, res) {
  ScoreDataRecordTeam.deleteMany({
    team: req.params.id,
    type: req.body.type,
    score: { $gte: req.body.score },
  }).exec((err, data) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(res, 200, "", "", data);
  });
}
