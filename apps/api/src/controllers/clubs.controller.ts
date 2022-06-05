import Club from "../models/club.model";
import { requestHandler, requestHandlerError } from "../utils/requestHandler";
import crypto from "crypto";
import User from "../models/user.model";
import Group from "../models/group.model";

export function getClub(req, res) {
  const id = req.params.id;
  if (id) {
    Club.findOne({
      id,
    })
      .populate(
        "coaches athletes admins",
        "-password -roles -active -checked -__v"
      )
      .exec((err, club) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "",
          "",
          [club].map((c) => {
            if (!c) {
              return c;
            }
            c.coaches = c.coaches.map((user) => {
              if (user.picture === "gravatar") {
                user.picture = `https://secure.gravatar.com/avatar/${crypto
                  .createHash("md5")
                  .update(user.email)
                  .digest("hex")}?size=300&d=404`;
              } else {
                user.picture = undefined;
              }
              user.email = undefined;
              return user;
            });
            c.admins = c.admins.map((user) => {
              if (user.picture === "gravatar") {
                user.picture = `https://secure.gravatar.com/avatar/${crypto
                  .createHash("md5")
                  .update(user.email)
                  .digest("hex")}?size=300&d=404`;
              } else {
                user.picture = undefined;
              }
              user.email = undefined;
              return user;
            });
            c.athletes = c.athletes.map((user) => {
              if (user.picture === "gravatar") {
                user.picture = `https://secure.gravatar.com/avatar/${crypto
                  .createHash("md5")
                  .update(user.email)
                  .digest("hex")}?size=300&d=404`;
              } else {
                user.picture = undefined;
              }
              user.email = undefined;
              return user;
            });
            return c;
          })[0]
        );
      });
  } else {
    Club.findOne({
      $or: [
        { coaches: { $in: req.userId } },
        { athletes: { $in: req.userId } },
        { admins: { $in: req.userId } },
      ],
    })
      .populate("coaches athletes admins", "-password")
      .exec((err, club) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(res, 200, "", "", club);
      });
  }
}
export function addMemberToClub(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Club.updateOne(
      { _id: req.params.id },
      { $addToSet: { athletes: users.map((user) => user._id) } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.club.athletes.update",
          "Club Athletes have been updated successfully!"
        );
      }
    );
  });
}
export function removeMemberFromClub(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Club.updateOne(
      { _id: req.params.id },
      {
        $pullAll: {
          athletes: users.map((user) => user._id),
          admins: users.map((user) => user._id),
          coaches: users.map((user) => user._id),
        },
      },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        Group.updateMany(
          { club: req.params.id },
          {
            $pullAll: {
              athletes: users.map((user) => user._id),
              coaches: users.map((user) => user._id),
            },
          },
          (err) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            return requestHandler(
              res,
              200,
              "success.club.athletes.update",
              "Club Athletes have been updated successfully!"
            );
          }
        );
      }
    );
  });
}
export function addCoachToClub(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Club.updateOne(
      { _id: req.params.id },
      { $addToSet: { coaches: users.map((user) => user._id) } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.club.coaches.update",
          "Club Coaches have been updated successfully!"
        );
      }
    );
  });
}
export function removeCoachFromClub(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Club.updateOne(
      { _id: req.params.id },
      {
        $pullAll: {
          coaches: users.map((user) => user._id),
        },
      },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.club.coaches.update",
          "Club Coaches have been updated successfully!"
        );
      }
    );
  });
}
export function addAdminToClub(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Club.updateOne(
      { _id: req.params.id },
      { $addToSet: { admins: users.map((user) => user._id) } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.club.admins.update",
          "Club Admins have been updated successfully!"
        );
      }
    );
  });
}
export function removeAdminFromClub(req, res) {
  User.find({ _id: req.body.users }, (err, users) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    Club.updateOne(
      { _id: req.params.id },
      {
        $pullAll: {
          admins: users.map((user) => user._id),
        },
      },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.club.admins.update",
          "Club Admins have been updated successfully!"
        );
      }
    );
  });
}
export function leaveClub(req, res) {
  Club.updateMany(
    {
      $or: [
        { coaches: { $in: req.userId } },
        { athletes: { $in: req.userId } },
        { admins: { $in: req.userId } },
      ],
    },
    {
      $pullAll: {
        athletes: [req.userId],
        admins: [req.userId],
        coaches: [req.userId],
      },
    },
    (err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      Group.updateMany(
        {
          $or: [
            { coaches: { $in: req.userId } },
            { athletes: { $in: req.userId } },
          ],
        },
        {
          $pullAll: {
            athletes: [req.userId],
            coaches: [req.userId],
          },
        },
        (err) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          return requestHandler(
            res,
            200,
            "success.club.leave",
            "Left the club successfully!"
          );
        }
      );
    }
  );
}
