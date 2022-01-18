import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true },
  firstname: { type: String, index: true },
  lastname: { type: String, index: true },
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  active: Boolean,
  picture: String,
});

UserSchema.index({ username: "text", firstname: "text", lastname: "text" });

const User = mongoose.model("User", UserSchema);

export default User;
