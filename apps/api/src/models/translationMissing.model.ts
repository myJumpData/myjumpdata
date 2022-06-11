import mongoose from "mongoose";

const TranslationMissing = mongoose.model(
  "TranslationMissing",
  new mongoose.Schema({
    key: { type: String, unique: true, index: true },
    namespace: { type: String, index: true },
  })
);

export default TranslationMissing;
