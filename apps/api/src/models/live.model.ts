import mongoose from "mongoose";

const Live = mongoose.model(
  "Live",
  new mongoose.Schema({
    type: String,
    key: String,
    code: String,
    count: Number,
  })
);

export default Live;
