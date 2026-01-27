import mongoose from "mongoose";

const CourtOfficerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    courtOfficerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: true,
    },
    designation: { type: String, default: "Court Officer" },
  },
  { timestamps: true },
);

export default mongoose.model("CourtOfficerProfile", CourtOfficerProfileSchema);
