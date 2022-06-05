import mongoose from "mongoose";

const Team = mongoose.model(
  "Team",
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

export default Team;
