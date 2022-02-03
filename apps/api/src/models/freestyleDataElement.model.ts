import mongoose from "mongoose";

const FreestyleDataElement = mongoose.model(
  "FreestyleDataElement",
  new mongoose.Schema({
    key: {
      type: String,
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
