import mongoose from 'mongoose';

const ScoreDataRecordOwn = mongoose.model(
  "ScoreDataRecordOwn",
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
    },
    {timestamps: true}
  )
);

export default ScoreDataRecordOwn;
