import mongoose from "mongoose";

const Translation = mongoose.model(
  "Translation",
  new mongoose.Schema({
    language: { type: String, index: true },
    namespace: { type: String, index: true },
    key: String,
    translation: String,
  })
);

export default Translation;
