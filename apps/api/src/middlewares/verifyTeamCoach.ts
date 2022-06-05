import { requestHandler, requestHandlerError } from "../utils/requestHandler";
import Team from "../models/team.model";

export function verifyTeamCoach(req, res, next) {
  Team.find({ _id: req.params.id, coaches: { $in: req.userId } }).exec(
    (err, group) => {
      if (err) {
        return requestHandlerError(res, err);
      }
      if (!group.length) {
        return requestHandler(
          res,
          401,
          "unauthorized.coachofteam.not",
          "Not a Coach of this team"
        );
      }
      return next();
    }
  );
}
