import Group from "../models/group.model";
import { requestHandler, requestHandlerError } from "../requestHandler";

export function verifyGroupCoach(req, res, next) {
  Group.find({ _id: req.params.id, coaches: { $in: req.userId } }).exec(
    (err, group) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (!group.length) {
        return requestHandler(
          res,
          401,
          "unauthorized.coachofgroup.not",
          "Not a Coach of this group"
        );
      }
      return next();
    }
  );
}
