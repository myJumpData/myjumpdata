import cors from "cors";
import express from "express";
import { APP_URL } from "./consts/host";
import AdminRoutes from "./routes/admin.routes";
import FreestyleRoutes from "./routes/freestyle.routes";
import GroupsRoutes from "./routes/groups.routes";
import LocalesRoutes from "./routes/locales.routes";
import ScoredataRoutes from "./routes/scoredata.routes";
import UserRoutes from "./routes/user.routes";
import UsersRoutes from "./routes/users.routes";
import fileUpload from "express-fileupload";
import path from "path";
import crypto from "crypto";
import verifyToken from "./middlewares/authJwt";
import User from "./models/user.model";
import { requestHandler, requestHandlerError } from "./requestHandler";
import Group from "./models/group.model";
import { verifyGroupCoach } from "./middlewares/verifyGroupCoach";
import mongoose from "mongoose";
import readUserPicture from "./utils/readUserPicture";

export default function createServer() {
  const app = express();
  app.use(
    cors({
      origin: APP_URL,
    })
  );
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", APP_URL);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
  });
  app.use(express.json());
  app.use(
    fileUpload({
      createParentPath: true,
      limits: {
        fileSize: 1024 * 1024 * 50,
      },
      abortOnLimit: true,
    })
  );

  app.post("/delete/track/freestyle", [verifyToken], (req, res) => {
    const id = req.body.id;
    User.findOneAndUpdate(
      { id: req.userId },
      { $pull: { freestyleTracks: { id: id } } },
      (err) => {
        if (err) {
          console.log(err);
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
  app.post(
    "/delete/track_group/freestyle/:id",
    [verifyToken, verifyGroupCoach],
    (req, res) => {
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
    }
  );

  app.post(
    "/upload/track_group/freestyle/:id",
    [verifyToken, verifyGroupCoach],
    (req: any, res) => {
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
          crypto.randomUUID() +
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
    }
  );
  app.post("/upload/track/freestyle", [verifyToken], (req: any, res) => {
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
      crypto.randomUUID() +
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
  });
  app.get("/track/freestyle", [verifyToken], (req, res) => {
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
  });
  app.get(
    "/track/freestyle_group/:id",
    [verifyToken, verifyGroupCoach],
    (req, res) => {
      const id = req.params.id;
      Group.findOne({ _id: id }, { coaches: 0 }).exec((err, group) => {
        if (err) {
          return requestHandlerError(res, err);
        }
        if (!group) {
          return requestHandler(
            res,
            404,
            "notfound.group",
            "Can't find group!"
          );
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
    }
  );
  app.get("/upload/:file", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../files/" + req.params.file));
  });

  UserRoutes(app);
  UsersRoutes(app);
  ScoredataRoutes(app);
  GroupsRoutes(app);
  FreestyleRoutes(app);
  LocalesRoutes(app);
  AdminRoutes(app);
  return app;
}
