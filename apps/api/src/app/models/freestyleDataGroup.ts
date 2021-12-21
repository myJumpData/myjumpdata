import mongoose from 'mongoose';

const FreestyleDataGroup = mongoose.model(
  'FreestyleDataGroup',
  new mongoose.Schema({
    key: {
      type: String,
      unique: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FreestyleDataGroup',
    },
  })
);

export default FreestyleDataGroup;
