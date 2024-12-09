import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    profile_image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('users', userSchema);

export default userModel;
