import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    province: {
      type: String,
      enum: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"],
      required: true,
    },
    clerkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["Supreme", "High", "District", "Session"],
    },
  },
  { timestamps: true },
);

const courtModel = mongoose.model("Court", courtSchema);
