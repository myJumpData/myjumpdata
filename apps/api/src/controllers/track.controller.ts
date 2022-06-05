import Group from "../models/group.model";
import { requestHandler, requestHandlerError } from "../utils/requestHandler";
import User from "../models/user.model";
import readUserPicture from "../utils/readUserPicture";
import mongoose from "mongoose";
import path from "path";
import crypto from "crypto";

export const getFreestyleGroupTrack = (req, res) => {
  const id = req.params.id;
  Group.findOne({ _id: id }, { coaches: 0 }).exec((err, group) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    if (!group) {
      return requestHandler(res, 404, "notfound.group", "Can't find group!");
    }
    User.find({ _id: group.athletes }).exec((err, users) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", {
        users: users.map((user) => {
          return {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            picture: readUserPicture(user),
            freestyleTracks: user.freestyleTracks,
          };
        }),
      });
    });
  });
};
export const getFreestyleTrack = (req, res) => {
  User.findOne({ _id: new mongoose.Types.ObjectId(req.userId) }).exec(
    (err, user) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(res, 200, "", "", {
        freestyleTracks: user.freestyleTracks,
      });
    }
  );
};
export const getFile = (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../files/" + req.params.file));
};
export const deleteFreestyleGroupTrack = (req, res) => {
  const id = req.body.id;
  const group = req.params.id;
  Group.findOne({ _id: group }).exec((err, group) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    User.findOneAndUpdate(
      {
        $and: [
          {
            _id: { $in: group.athletes },
          },
          {
            $in: { freestyleTracks: { id: id } },
          },
        ],
      },
      { $pull: { freestyleTracks: { id: id } } },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        return requestHandler(
          res,
          200,
          "success.file.delete",
          "File deleted successfully"
        );
      }
    );
  });
};
export const deleteFreestyleTrack = (req, res) => {
  const id = req.body.id;
  User.findOneAndUpdate(
    { id: req.userId },
    { $pull: { freestyleTracks: { id: id } } },
    (err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      return requestHandler(
        res,
        200,
        "success.file.delete",
        "File deleted successfully"
      );
    }
  );
};
export const uploadFreestyleGroupTrack = (req: any, res) => {
  if (!req.files) {
    return requestHandler(
      res,
      400,
      "error.file.none",
      "No files were uploaded"
    );
  }
  const file = req.files.file;
  const user = req.body.user;
  const group = req.params.id;
  Group.findOne({ _id: group }).exec((err, group) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    if (!group.athletes.includes(user)) {
      return requestHandler(
        res,
        400,
        "error.user.notingroup",
        "User is not part of this Group"
      );
    }
    const extensionName = path.extname(file.name); // fetch the file extension
    const allowedExtension = [".wav", ".mp3"];
    if (!allowedExtension.includes(extensionName)) {
      return requestHandler(res, 422, "error.file.invalid", "Invalid File");
    }
    const fname =
      Date.now() +
      "_" +
      crypto.randomBytes(16).toString("hex") +
      "_" +
      crypto.createHash("md5").update(file.name).digest("hex") +
      extensionName;
    const p = __dirname + "/../files/" + fname;
    file.mv(p, (err) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      User.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(user) },
        {
          $push: { freestyleTracks: [{ id: fname, name: file.name }] },
        },
        (err, user) => {
          if (err) {
            return requestHandlerError(res, err);
          }
          return requestHandler(
            res,
            200,
            "success.file.upload",
            "File uploaded successfully",
            { user }
          );
        }
      );
    });
  });
};
export const uploadFreestyleTrack = (req: any, res) => {
  if (!req.files) {
    return requestHandler(
      res,
      400,
      "error.file.none",
      "No files were uploaded"
    );
  }
  const file = req.files.file;
  const extensionName = path.extname(file.name); // fetch the file extension
  const allowedExtension = [".wav", ".mp3"];
  if (!allowedExtension.includes(extensionName)) {
    return requestHandler(res, 422, "error.file.invalid", "Invalid File");
  }
  const fname =
    Date.now() +
    "_" +
    crypto.randomBytes(16).toString("hex") +
    "_" +
    crypto.createHash("md5").update(file.name).digest("hex") +
    extensionName;
  const p = __dirname + "/../files/" + fname;
  file.mv(p, (err) => {
    if (err) {
      return requestHandlerError(res, err);
    }
    User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.userId) },
      { freestyleTracks: [] },
      (err) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        User.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(req.userId) },
          { $push: { freestyleTracks: [{ id: fname, name: file.name }] } },
          (err, user) => {
            if (err) {
              return requestHandlerError(res, err);
            }
            return requestHandler(
              res,
              200,
              "success.file.upload",
              "File uploaded successfully",
              { user }
            );
          }
        );
      }
    );
  });
};
