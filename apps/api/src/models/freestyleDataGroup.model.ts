import mongoose from "mongoose";

const FreestyleDataGroup = mongoose.model(
  "FreestyleDataGroup",
  new mongoose.Schema({
    key: {
      type: String,
      unique: true,
    },
    set: Boolean,
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FreestyleDataGroup",
    },
  })
);

export default FreestyleDataGroup;
