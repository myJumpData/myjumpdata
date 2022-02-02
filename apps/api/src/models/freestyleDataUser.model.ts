import mongoose from "mongoose";

const FreestyleDataUser = mongoose.model(
  "FreestyleDataUser",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      element: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FreestyleDataElement",
      },
      stateCoach: Boolean,
      coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      stateUser: Boolean,
    },
    { timestamps: true }
  )
);

export default FreestyleDataUser;
