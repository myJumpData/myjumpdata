import mongoose from "mongoose";

const Group = mongoose.model(
  "Group",
  new mongoose.Schema({
    name: String,
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    coaches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    athletes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  })
);

export default Group;
