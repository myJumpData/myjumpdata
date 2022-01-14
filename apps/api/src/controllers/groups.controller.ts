import crypto from 'crypto';
import Group from '../models/group.model';
import User from '../models/user.model';

export function createGroup(req, res) {
  if (!req.body.name) {
    return res.status(400).send({ message: { text: 'No name provided!' } });
  }
  const group = new Group({
    name: req.body.name,
  });
  group.save((err, group) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    User.find({ _id: req.userId }, (err, coaches) => {
      group.coaches = coaches.map((coach) => coach._id);
      group.save((err) => {
        if (err) {
          return res.status(500).send({ message: err });
        }

        return res.send({
          message: { text: 'Group was created succcessfully!' },
        });
      });
    });
  });
}

export function updateGroupName(req, res) {
  Group.findOne({ _id: req.params.id })
    .select('-coaches -athletes -_id -__v')
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (req.body.name && group.name !== req.body.name) {
        Group.updateOne(
          { _id: req.params.id },
          { name: req.body.name.toLowerCase() }
        ).exec((err) => {
          if (err) {
            return res.status(500).send({ message: err });
          }
          Group.findOne({ _id: req.params.id })
            .select('-coaches -athletes -_id -__v')
            .exec((err, new_group) => {
              if (err) {
                return res.status(500).send({ message: err });
              }
              return res.send({ group: new_group });
            });
        });
      } else {
        return res.send({ group });
      }
    });
}

export function getGroup(req, res) {
  Group.findOne({ _id: req.params.id })
    .populate('coaches athletes', '-password -roles -__v -_id')
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      const athletes = group.athletes.map((d) => {
        let picture: null | string = null;
        if (d.picture === 'gravatar') {
          picture = `https://secure.gravatar.com/avatar/${crypto
            .createHash('md5')
            .update(d.email)
            .digest('hex')}?size=300&d=404`;
        }
        return {
          firstname: d.firstname,
          lastname: d.lastname,
          username: d.username,
          picture,
        };
      });
      const coaches = group.coaches.map((d) => {
        let picture: null | string = null;
        if (d.picture === 'gravatar') {
          picture = `https://secure.gravatar.com/avatar/${crypto
            .createHash('md5')
            .update(d.email)
            .digest('hex')}?size=300&d=404`;
        }
        return {
          firstname: d.firstname,
          lastname: d.lastname,
          username: d.username,
          picture,
        };
      });
      res.send({
        group: { name: group.name, _id: group._id, athletes, coaches },
      });
    });
}

export function getGroups(req, res) {
  Group.find({
    $or: [{ coaches: { $in: req.userId } }, { athletes: { $in: req.userId } }],
  })
    .populate('coaches athletes', '-password')
    .exec((err, groups) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      res.send({ groups });
    });
}

export function addAthletesToGroup(req, res) {
  Group.find({ _id: req.params.id })
    .populate('coaches athletes', '-password')
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!group[0].coaches.some((coach) => coach.id === req.userId)) {
        return res.status(401).send({ message: { text: 'Need Coach Role!' } });
      }
      User.find({ _id: req.body.users }, (err, users) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        Group.updateOne(
          { _id: req.params.id },
          { $addToSet: { athletes: users.map((user) => user._id) } },
          (err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({
              message: {
                text: 'Group Athletes have been updated successfully!',
              },
            });
          }
        );
      });
    });
}

export function removeAthletesFromGroup(req, res) {
  Group.find({ _id: req.params.id })
    .populate('coaches athletes', '-password')
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!group[0].coaches.some((coach) => coach.id === req.userId)) {
        return res.status(401).send({ message: { text: 'Need Coach Role!' } });
      }
      User.find({ _id: req.body.users }, (err, users) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        Group.updateOne(
          { _id: req.params.id },
          { $pullAll: { athletes: users.map((user) => user._id) } },
          (err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({
              message: {
                text: 'Group Athletes have been updated successfully!',
              },
            });
          }
        );
      });
    });
}

export function addCoachesToGroup(req, res) {
  Group.find({ _id: req.params.id })
    .populate('coaches athletes', '-password')
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!group[0].coaches.some((coach) => coach.id === req.userId)) {
        return res.status(401).send({ message: { text: 'Need Coach Role!' } });
      }
      User.find({ _id: req.body.coach }, (err, users) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        Group.updateOne(
          { _id: req.params.id },
          { $addToSet: { coaches: users.map((user) => user._id) } },
          (err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({
              message: {
                text: 'Group Coaches have been updated successfully!',
              },
            });
          }
        );
      });
    });
}

export function removeCoachesFromGroup(req, res) {
  Group.find({ _id: req.params.id })
    .populate('coaches athletes', '-password')
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!group[0].coaches.some((coach) => coach.id === req.userId)) {
        return res.status(401).send({ message: { text: 'Need Coach Role!' } });
      }
      User.find({ _id: req.body.coach }, (err, users) => {
        if (err) {
          return res.status(500).send({ message: err });
        }
        Group.updateOne(
          { _id: req.params.id },
          { $pullAll: { coaches: users.map((user) => user._id) } },
          (err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({
              message: {
                text: 'Group Coaches have been updated successfully!',
              },
            });
          }
        );
      });
    });
}

export function deleteGroup(req, res) {
  Group.deleteOne({ _id: req.params.id }).exec((err) => {
    if (err) {
      return res.status(500).send({ message: err });
    }
    return res
      .status(200)
      .send({ message: { text: 'Deleted Group Successfully' } });
  });
}
