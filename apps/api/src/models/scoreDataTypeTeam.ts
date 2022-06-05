import mongoose from "mongoose";

const ScoreDataTypeTeam = mongoose.model(
  "ScoreDataTypeTeam",
  new mongoose.Schema({
    name: String,
    order: Number,
  })
);

export default ScoreDataTypeTeam;
