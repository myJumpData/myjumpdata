import mongoose from "mongoose";

const ScoreDataRecordTeam = mongoose.model(
  "ScoreDataRecordTeam",
  new mongoose.Schema(
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScoreDataTypeTeam",
      },
      score: Number,
    },
    { timestamps: true }
  )
);

export default ScoreDataRecordTeam;
