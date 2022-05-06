import mongoose from "mongoose";

const FreestyleDataElement = mongoose.model(
  "FreestyleDataElement",
  new mongoose.Schema({
    key: {
      type: String,
      unique: true,
    },
    level: String,
    compiled: Boolean,
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FreestyleDataGroup",
      },
    ],
  })
);

export default FreestyleDataElement;
