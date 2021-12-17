import mogoose from 'mongoose';

const Group = mogoose.model(
  "Group",
  new mogoose.Schema({
    name: String,
    coaches: [
      {
        type: mogoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    athletes: [
      {
        type: mogoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  })
);

export default Group;
