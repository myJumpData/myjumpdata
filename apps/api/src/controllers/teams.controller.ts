import { requestHandler, requestHandlerError } from "../utils/requestHandler";
import Team from "../models/team.model";
import mongoose from "mongoose";
import User from "../models/user.model";
import crypto from "crypto";
import Club from "../models/club.model";

export function createTeam(req, res) {
  if (!req.body.name) {
    return requestHandler(res, 400, "missing.field.name", "No name provided!");
  }
  const team = new Team({
    name: req.body.name,
    club: new mongoose.Types.ObjectId(req.body.club),
  });
  team.save((err, team) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    User.find({ _id: req.userId }, (err, coaches) => {
      team.coaches = coaches.map((coach) => coach._id);
      team.save((err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          201,
          "success.create.team",
          "Team was created succcessfully!",
          team
        );
      });
    });
  });
}
export function updateTeamName(req, res) {
  Team.findOne({ _id: req.params.id })
    .select("-coaches -athletes -_id -__v")
    .exec((err, team) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (req.body.name && team.name !== req.body.name) {
        Team.updateOne(
          { _id: req.params.id },
          { name: req.body.name.toLowerCase() }
        ).exec((err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          Team.findOne({ _id: req.params.id })
            .select("-coaches -athletes -_id -__v")
            .exec((err, new_team) => {
              if (err) {
                return requestHandlerError(res, err);
              }
              return requestHandler(
                res,
                200,
                "success.update.team.name",
                "Success updating team name!",
                new_team
              );
            });
        });
      } else {
        return requestHandler(
          res,
          200,
          "success.update.group.name",
          "Success updating group name!",
          team
        );
      }
    });
}
export function getTeams(req, res) {
  Club.findOne({
    $or: [{ coaches: { $in: req.userId } }, { athletes: { $in: req.userId } }],
  }).exec((err, club: any) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    if (!club) {
      return requestHandler(res, 200, "", "", []);
    }
    Team.find({
      club: { $in: club._id },
      $or: [
        { coaches: { $in: req.userId } },
        { athletes: { $in: req.userId } },
      ],
    })
      .populate("coaches athletes", "-password")
      .exec((err, team) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(res, 200, "", "", team);
      });
  });
}
export function getTeam(req, res) {
  Team.findOne({ _id: req.params.id })
    .populate("coaches athletes", "-password -roles -__v")
    .exec((err, team) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (team) {
        const athletes = team.athletes.map((d) => {
          let picture: null | string = null;
          if (d.picture === "gravatar") {
            picture = `https://secure.gravatar.com/avatar/${crypto
              .createHash("md5")
              .update(d.email)
              .digest("hex")}?size=300&d=404`;
          }
          return {
            id: d._id,
            firstname: d.firstname,
            lastname: d.lastname,
            username: d.username,
            picture,
          };
        });
        const coaches = team.coaches.map((d) => {
          let picture: null | string = null;
          if (d.picture === "gravatar") {
            picture = `https://secure.gravatar.com/avatar/${crypto
              .createHash("md5")
              .update(d.email)
              .digest("hex")}?size=300&d=404`;
          }
          return {
            id: d._id,
            firstname: d.firstname,
            lastname: d.lastname,
            username: d.username,
            picture,
          };
        });
        return requestHandler(res, 200, "", "", {
          name: team.name,
          _id: team._id,
          athletes,
          coaches,
        });
      } else {
        return requestHandler(res, 404, "", "");
      }
    });
}
export function deleteTeam(req, res) {
  Team.deleteOne({ _id: req.params.id }).exec((err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    return requestHandler(
      res,
      200,
      "success.team.delete",
      "Deleted Team Successfully"
    );
  });
}

export function addAthletesToTeam(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Team.updateOne(
      { _id: req.params.id },
      { $addToSet: { athletes: users.map((user) => user._id) } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.team.athletes.update",
          "Team Athletes have been updated successfully!"
        );
      }
    );
  });
}
export function removeAthletesFromTeam(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Team.updateOne(
      { _id: req.params.id },
      { $pullAll: { athletes: users.map((user) => user._id) } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.team.athletes.update",
          "Team Athletes have been updated successfully!"
        );
      }
    );
  });
}
export function addCoachesToTeam(req, res) {
  User.find({ _id: req.body.coach }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Team.updateOne(
      { _id: req.params.id },
      { $addToSet: { coaches: users.map((user) => user._id) } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.team.coaches.update",
          "Team Coaches have been updated successfully!"
        );
      }
    );
  });
}
export function removeCoachesFromTeam(req, res) {
  User.find({ _id: req.body.coach }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Team.updateOne(
      { _id: req.params.id },
      { $pullAll: { coaches: users.map((user) => user._id) } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.team.coaches.update",
          "Team Coaches have been updated successfully!"
        );
      }
    );
  });
}
export function leaveTeam(req, res) {
  Team.findOne({ _id: req.params.id }).exec((err, group) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    if (group) {
      if (group.coaches.includes(req.userId)) {
        Team.updateOne(
          { _id: req.params.id },
          { $pull: { coaches: req.userId } },
          (err) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            return requestHandler(
              res,
              200,
              "success.team.coach.leave",
              "Coach has left the team successfully!"
            );
          }
        );
      } else if (group.athletes.includes(req.userId)) {
        Team.updateOne(
          { _id: req.params.id },
          { $pull: { athletes: req.userId } },
          (err) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            return requestHandler(
              res,
              200,
              "success.team.athlete.leave",
              "Athlete has left the team successfully!"
            );
          }
        );
      }
    }
  });
}
