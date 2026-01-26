import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dob: { type: Date, required: true },
    city: { type: String, required: true },
    province: {
      type: String,
      enum: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"],
      required: true,
    },
    profileImage: { type: String, default: null },
  },
  { timestamps: true },
);

const UserProfileModel = mongoose.model("UserProfile", UserProfileSchema);

export default UserProfileModel;
