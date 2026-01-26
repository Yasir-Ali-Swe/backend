import mongoose from "mongoose";

const lawyerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    specialization: {
      type: [String],
      required: true,
    },

    barCouncil: {
      type: String,
      enum: [
        "Punjab Bar Council",
        "Sindh Bar Council",
        "Khyber Pakhtunkhwa Bar Council",
        "Balochistan Bar Council",
        "Islamabad Bar Council",
      ],
      required: true,
    },

    lawyerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
const LawyerProfile = mongoose.model("LawyerProfile", lawyerProfileSchema);

export default LawyerProfile;
