import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "client", "clerk", "court_officer", "lawyer"],
      default: "client",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
const userModel = mongoose.model("User", userSchema);

export default userModel;
