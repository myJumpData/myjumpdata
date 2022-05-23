import mongoose from "mongoose";

const Club = mongoose.model(
  "Club",
  new mongoose.Schema({
    name: String,
    country: String,
    state: String,
    city: String,
    logo: String,
    coaches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    athletes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  })
);

export default Club;
