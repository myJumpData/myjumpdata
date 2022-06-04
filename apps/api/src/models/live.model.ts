import mongoose from "mongoose";

const Live = mongoose.model(
  "Live",
  new mongoose.Schema(
    {
      type: String,
      key: String,
      code: String,
      count: Number,
      expireAt: {
        type: Date,
        default: new Date(new Date().valueOf() + 1000 * 60 * 60 * 24 * 7),
        expires: 60 * 60 * 24 * 7,
      },
    },
    { timestamps: true }
  )
);

export default Live;
