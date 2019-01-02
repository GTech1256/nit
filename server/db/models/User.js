import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    subName: String,
    birth_at: Date,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    refreshToken: [String],
    files: [
      {
        url: String,
        name: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.statics.hashPassword = async (inputPassword) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(inputPassword, salt);
  } catch (err) {
    throw new Error(`Password hashing failed ${err}`);
  }
};
userSchema.statics.checkPassword = async (inputPassword, hashedPassword) => {
  if (!inputPassword) return false;

  try {
    return await bcryptjs.compare(inputPassword, hashedPassword);
  } catch (err) {
    return err;
  }
};

export default mongoose.model('User', userSchema);
