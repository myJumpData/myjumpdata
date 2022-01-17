import responseHandler, {
  responseHandlerError,
} from "../helper/responseHandler";
import Group from "../models/group.model";

export function verifyGroupCoach(req, res, next) {
  Group.find({ _id: req.params.id, coaches: { $in: req.userId } }).exec(
    (err, group) => {
      if (err) {
        return responseHandlerError(res, err);
      }
      if (!group.length) {
        return responseHandler(
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
