import mongoose from 'mongoose';

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: { type: String, unique: true },
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
    active: Boolean,
  })
);

export default User;
