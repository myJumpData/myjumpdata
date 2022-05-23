import { requestHandler, requestHandlerError } from "../requestHandler";
import Club from "../models/club.model";

export function verifyClubAdmin(req, res, next) {
  Club.find({ _id: req.params.id, admins: { $in: req.userId } }).exec(
    (err, group) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (!group.length) {
        return requestHandler(
          res,
          401,
          "unauthorized.adminofclub.not",
          "Not a Admin of this club"
        );
      }
      return next();
    }
  );
}
