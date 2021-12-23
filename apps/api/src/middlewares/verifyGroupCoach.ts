import Group from '../models/group.model';

export function verifyGroupCoach(req, res, next) {
  Group.find({ _id: req.params.id, coaches: { $in: req.userId } }).exec(
    (err, group) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      if (!group.length) {
        return res.status(401).send({
          message: {
            text: 'Not a Coach of this group',
            key: 'unauthorized.coachofgroup.not',
          },
        });
      }
      return next();
    }
  );
}
