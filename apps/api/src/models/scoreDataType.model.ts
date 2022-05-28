import mongoose from "mongoose";

const ScoreDataType = mongoose.model(
  "ScoreDataType",
  new mongoose.Schema({
    name: String,
    order: Number,
  })
);

export default ScoreDataType;
