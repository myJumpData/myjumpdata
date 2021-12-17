import mongoose from 'mongoose';

const ScoreDataRecord = mongoose.model(
  "ScoreDataRecord",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScoreDataType",
      },
      score: Number,
      coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {timestamps: true}
  )
);

export default ScoreDataRecord;
