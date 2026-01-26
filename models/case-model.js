import mongoose from "mongoose";
const CaseSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, unique: true, sparse: true },

    title: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "Civil",
        "Criminal",
        "Family",
        "Corporate",
        "Labor",
        "Property",
        "Political",
        "Tax",
      ],
      required: true,
    },

    description: { type: String, default: null },

    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      default: null,
    },

    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courtOfficerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "active", "decided", "closed"],
      default: "pending",
    },

    submissionStatus: {
      type: String,
      enum: ["draft", "submitted", "registered"],
      default: "draft",
    },

    parties: [
      {
        role: {
          type: String,
          enum: ["PLAINTIFF", "DEFENDANT"],
          required: true,
        },
        name: { type: String, required: true },
      },
    ],

    filedByLawyerAt: { type: Date, default: null },
    registeredByClerkAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("Case", CaseSchema);
