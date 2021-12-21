import ScoreDataRecord from '../models/scoreDataRecord.model';
import Group from '../models/group.model';
import ScoreDataType from '../models/scoreDataType.model';
import ScoreDataRecordOwn from '../models/scoreDataRecordOwn.model';
import mongoose from 'mongoose';

export function saveScoreData(req: any, res: any) {
  if (!req.body.user) {
    return res.status(400).send({ message: { text: 'No User provided!' } });
  }
  if (!req.body.score) {
    return res.status(400).send({ message: { text: 'No Score provided!' } });
  }
  if (!req.body.type) {
    return res.status(400).send({ message: { text: 'No Type provided!' } });
  }

  const scoreData = new ScoreDataRecord({
    user: new mongoose.Types.ObjectId(req.body.user),
    score: req.body.score,
    coach: new mongoose.Types.ObjectId(req.userId),
    type: new mongoose.Types.ObjectId(req.body.type),
  });

  scoreData.save((err: any, scoredata: any) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    return res.send({ scoredata });
  });
}

export function getScoreDataTypes(req: any, res: any) {
  ScoreDataType.find({}, (err, scoreDataTypes) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    res.send({ scoreDataTypes });
  });
}

export function getScoreDataHigh(req: any, res: any) {
  const id = req.params.id;
  const type = req.params.type;
  Group.findOne({ _id: id }, { coaches: 0 })
    .populate('athletes', '-password -roles -email')
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!group) {
        return res.status(404).send({ message: { text: "Can't find group!" } });
      }
      const athletes = group.athletes.map((athlete: any) => athlete._id);
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
        .sort('user -score -type')
        .populate('user', '-password -email -roles')
        .exec((err, records) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          const response: { user: any; score: number }[] = [];
          records.forEach((item) => {
            if (!response.some((response) => response.user === item.user)) {
              response.push(item);
            }
          });
          group.athletes.forEach((item: { username: any }) => {
            if (
              !response.some(
                (response) => response.user.username === item.username
              )
            ) {
              response.push({ user: item, score: 0 });
            }
          });

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
          return res.send({ high: high, scores: response });
        });
    });
}

export function getScoreDataOwn(req: any, res: any) {
  ScoreDataType.find({})
    .then((scoreDataTypesList) => {
      const jobQueries: any[] = [];
      scoreDataTypesList.forEach((type) => {
        jobQueries.push(
          ScoreDataRecordOwn.findOne({ user: req.userId, type: type._id })
            .sort('-score')
            .populate('type', '-__v')
        );
      });
      return Promise.all(jobQueries);
    })
    .then((data) => {
      ScoreDataType.find({}, (err, scoreDataTypes) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        const response = data;
        scoreDataTypes.forEach((item) => {
          if (!response.some((r) => r?.type.name === item.name)) {
            response.push({ type: item, score: 0 });
          }
        });
        return res.send({ data: response });
      });
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
    });
}

export function saveScoreDataOwn(req: any, res: any) {
  if (!req.body.score) {
    return res.status(400).send({ message: { text: 'No Score provided!' } });
  }
  if (!req.body.type) {
    return res.status(400).send({ message: { text: 'No Type provided!' } });
  }

  const scoreDataOwn = new ScoreDataRecordOwn({
    user: new mongoose.Types.ObjectId(req.userId),
    score: req.body.score,
    type: new mongoose.Types.ObjectId(req.body.type),
  });

  scoreDataOwn.save((err: any, scoredata: any) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    return res.send({ scoredata });
  });
}
