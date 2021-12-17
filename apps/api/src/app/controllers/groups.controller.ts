import User from "../models/user.model";
import Group from "../models/group.model";

export function createGroup(req: any, res: any) {
  if (!req.body.name) {
    return res.status(400).send({message: {text: "No name provided!"}});
  }
  const group = new Group({
    name: req.body.name,
  });
  group.save((err: any, group: any) => {
    if (err) {
      return res.status(500).send({message: err});
    }
    User.find({_id: req.userId}, (err, coaches) => {
      group.coaches = coaches.map((coach) => coach._id);
      group.save((err: any) => {
        if (err) {
          return res.status(500).send({message: err});
        }

        return res.send({message: {text: "Group was created succcessfully!"}});
      });
    });
  });
}

export function updateGroupName(req: any, res: any) {
  Group.findOne({_id: req.params.id})
    .select("-coaches -athletes -_id -__v")
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      if (req.body.name && group.name !== req.body.name) {
        Group.updateOne(
          {_id: req.params.id},
          {name: req.body.name.toLowerCase()}
        ).exec((err) => {
          if (err) {
            return res.status(500).send({message: err});
          }
          Group.findOne({_id: req.params.id})
            .select("-coaches -athletes -_id -__v")
            .exec((err, new_group) => {
              if (err) {
                return res.status(500).send({message: err});
              }
              return res.send({group: new_group});
            });
        });
      } else {
        return res.send({group});
      }
    });
}

export function getGroup(req: any, res: any) {
  Group.findOne({_id: req.params.id})
    .populate("coaches athletes", "-password")
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      res.send({group});
    });
}

export function getGroups(req: any, res: any) {
  Group.find({
      $or: [{coaches: {$in: req.userId}}, {athletes: {$in: req.userId}}],
    })
    .populate("coaches athletes", "-password")
    .exec((err, groups) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      res.send({groups});
    });
}

export function addAthletesToGroup(req: any, res: any) {
  Group.find({_id: req.params.id})
    .populate("coaches athletes", "-password")
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      if (!group[0].coaches.some((coach: any) => coach.id === req.userId)) {
        return res.status(401).send({message: {text: "Need Coach Role!"}});
      }
      User.find({_id: req.body.users}, (err, users) => {
        if (err) {
          return res.status(500).send({message: err});
        }
        Group.updateOne(
          {_id: req.params.id},
          {$addToSet: {athletes: users.map((user) => user._id)}},
          (err: any) => {
            if (err) {
              res.status(500).send({message: err});
              return;
            }
            res.send({
              message: {text: "Group Athletes have been updated successfully!"},
            });
          }
        );
      });
    });
}

export function removeAthletesFromGroup(req: any, res: any) {
  Group.find({_id: req.params.id})
    .populate("coaches athletes", "-password")
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      if (!group[0].coaches.some((coach: any) => coach.id === req.userId)) {
        return res.status(401).send({message: {text: "Need Coach Role!"}});
      }
      User.find({_id: req.body.users}, (err, users) => {
        if (err) {
          return res.status(500).send({message: err});
        }
        Group.updateOne(
          {_id: req.params.id},
          {$pullAll: {athletes: users.map((user) => user._id)}},
          (err: any) => {
            if (err) {
              res.status(500).send({message: err});
              return;
            }
            res.send({
              message: {text: "Group Athletes have been updated successfully!"},
            });
          }
        );
      });
    });
}

export function addCoachesToGroup(req: any, res: any) {
  Group.find({_id: req.params.id})
    .populate("coaches athletes", "-password")
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      if (!group[0].coaches.some((coach: any) => coach.id === req.userId)) {
        return res.status(401).send({message: {text: "Need Coach Role!"}});
      }
      User.find({_id: req.body.coach}, (err, users) => {
        if (err) {
          return res.status(500).send({message: err});
        }
        Group.updateOne(
          {_id: req.params.id},
          {$addToSet: {coaches: users.map((user) => user._id)}},
          (err: any) => {
            if (err) {
              res.status(500).send({message: err});
              return;
            }
            res.send({
              message: {text: "Group Coaches have been updated successfully!"},
            });
          }
        );
      });
    });
}

export function removeCoachesFromGroup(req: any, res: any) {
  Group.find({_id: req.params.id})
    .populate("coaches athletes", "-password")
    .exec((err, group) => {
      if (err) {
        return res.status(500).send({message: err});
      }
      if (!group[0].coaches.some((coach: any) => coach.id === req.userId)) {
        return res.status(401).send({message: {text: "Need Coach Role!"}});
      }
      User.find({_id: req.body.coach}, (err, users) => {
        if (err) {
          return res.status(500).send({message: err});
        }
        Group.updateOne(
          {_id: req.params.id},
          {$pullAll: {coaches: users.map((user) => user._id)}},
          (err: any) => {
            if (err) {
              res.status(500).send({message: err});
              return;
            }
            res.send({
              message: {text: "Group Coaches have been updated successfully!"},
            });
          }
        );
      });
    });
}

export function deleteGroup(req: any, res: any) {
  Group.deleteOne({_id: req.params.id}).exec((err) => {
    if (err) {
      return res.status(500).send({message: err});
    }
    return res.status(200).send({message: {text: "Deleted Group Successfully"}});
  });
}
