import caseModel from "../models/case-model.js";
import clerkProfileModel from "../models/clerk-profile-model.js";
import courtOfficerProfileModel from "../models/court-officer-profile-model.js";

export const lawyerDraftCase = async (req, res) => {
    try {
        const lawyerId = req.userId;
        if (!lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const { title, type, description, parties } = req.body;
        if (!title || !type || !description || !lawyerId) {
            return res.status(400).json({ success: false, message: "title, type, description and lawyerId are required" })
        }
        const draftCase = await caseModel.create({ title, type, description, lawyerId, parties })
        return res.status(201).json({ success: true, message: "Case drafted successfully", data: draftCase })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export const lawyerUpateTheDraftCase = async (req, res) => {
    try {
        const lawyerId = req.userId.toString();
        if (!lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const { caseId } = req.params;
        if (!caseId) {
            return res.status(400).json({ success: false, message: "caseId is required" })
        }
        const draftCase = await caseModel.findById(caseId);
        if (!draftCase) {
            return res.status(404).json({ success: false, message: "Case not found" })
        }
        if (draftCase.lawyerId.toString() !== lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        if (draftCase.status !== "pending") {
            return res.status(400).json({ success: false, message: "You can not update the case" })
        }
        const updatedCase = await caseModel.findByIdAndUpdate(caseId, { $set: req.body }, { new: true })
        return res.status(200).json({ success: true, message: "Case updated successfully", data: updatedCase })
    } catch (error) {
        res.status(500).json({ success: false, message: "Intternal Server Error", error: error.message })
    }
}


export const lawyerDeleteTheDraftCase = async (req, res) => {
    try {
        const lawyerId = req.userId.toString();
        if (!lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const { caseId } = req.params;
        if (!caseId) {
            return res.status(400).json({ success: false, message: "caseId is required" })
        }
        const draftCase = await caseModel.findById(caseId);
        if (!draftCase) {
            return res.status(404).json({ success: false, message: "Case not found" })
        }
        if (draftCase.lawyerId.toString() !== lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        if (draftCase.status !== "pending") {
            return res.status(400).json({ success: false, message: "You can not delete the case" })
        }
        await caseModel.findByIdAndDelete(caseId)
        return res.status(200).json({ success: true, message: "Case deleted successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "Intternal Server Error", error: error.message })
    }
}

export const lawyerGetTheCaseById = async (req, res) => {
    try {
        const lawyerId = req.userId.toString();
        if (!lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const { caseId } = req.params;
        if (!caseId) {
            return res.status(400).json({ success: false, message: "caseId is required" })
        }
        const draftCase = await caseModel.findById(caseId);
        if (!draftCase) {
            return res.status(404).json({ success: false, message: "Case not found" })
        }
        if (draftCase.lawyerId.toString() !== lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        return res.status(200).json({ success: true, message: "Case fetched successfully", data: draftCase })
    } catch (error) {
        res.status(500).json({ success: false, message: "Intternal Server Error", error: error.message })
    }
}

export const lawyerGetAllTheCase = async (req, res) => {
    try {
        const lawyerId = req.userId.toString();
        if (!lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const draftCase = await caseModel.find({ lawyerId })
        return res.status(200).json({ success: true, message: "Case fetched successfully", data: draftCase })
    } catch (error) {
        res.status(500).json({ success: false, message: "Intternal Server Error", error: error.message })
    }
}

export const lawyerSubmitCase = async (req, res) => {
    try {
        const lawyerId = req.userId.toString();
        if (!lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const { caseId } = req.params;
        const { courtId } = req.body;
        if (!caseId) {
            return res.status(400).json({ success: false, message: "caseId is required" })
        }
        if (!courtId) {
            return res.status(400).json({ success: false, message: "courtId is required" })
        }
        const draftCase = await caseModel.findById(caseId);
        if (!draftCase) {
            return res.status(404).json({ success: false, message: "Case not found" })
        }
        if (draftCase.lawyerId.toString() !== lawyerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        if (draftCase.status !== "pending") {
            return res.status(400).json({ success: false, message: "You can not submit the case" })
        }
        if (draftCase.submissionStatus !== "draft") {
            return res.status(400).json({ success: false, message: "You can only submit the draft case" })
        }
        const submittedCase = await caseModel.findByIdAndUpdate(caseId, { $set: { submissionStatus: "submitted", filedByLawyerAt: new Date(), courtId: courtId } }, { new: true })
        return res.status(200).json({ success: true, message: "Case submitted successfully", data: submittedCase })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}




export const clerkGetSubmitedCases = async (req, res) => {
    try {
        const clerkId = req.userId.toString();
        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const clerkProfile = await clerkProfileModel.findOne({ userId: clerkId })
        if (!clerkProfile) {
            return res.status(404).json({ success: false, message: "Clerk profile not found" })
        }

        const clerkCourtId = clerkProfile.courtId;
        const submittedCases = await caseModel.find({ submissionStatus: "submitted", courtId: clerkCourtId })
        return res.status(200).json({ success: true, message: "Submitted cases fetched successfully", data: submittedCases })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, success: false })
    }
}


export const clerkRegisterCase = async (req, res) => {
    try {
        const clerkId = req.userId.toString();
        const caseId = req.params.caseId;
        const { courtOfficerId } = req.body;

        if (!caseId || !courtOfficerId) {
            return res
                .status(400)
                .json({ message: "Case ID and Court Officer ID are required." });
        }

        const clerkProfile = await clerkProfileModel.findOne({ userId: clerkId });
        if (!clerkProfile) {
            return res.status(404).json({ message: "Clerk profile not found." });
        }

        const existingCase = await caseModel.findById(caseId);

        if (!existingCase || existingCase.submissionStatus !== "submitted") {
            return res.status(404).json({ message: "Case not found." });
        }

        const courtOfficer = await courtOfficerProfileModel.findOne({
            userId: courtOfficerId,
            courtId: clerkProfile.courtId,
        });

        if (!courtOfficer) {
            return res
                .status(404)
                .json({ message: "Court Officer not found in your court." });
        }

        if (
            !existingCase.courtId ||
            existingCase.courtId.toString() !== clerkProfile.courtId.toString()
        ) {
            return res.status(403).json({
                message: "You are not authorized to register this case.",
            });
        }

        existingCase.caseNumber = `CASE-${Date.now()}`;
        existingCase.submissionStatus = "registered";
        existingCase.status = "active";
        existingCase.courtOfficerId = courtOfficerId;
        existingCase.registeredByClerkAt = new Date();

        await existingCase.save();
        res
            .status(200)
            .json({ message: "Case registered successfully.", case: existingCase });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message, success: false });
    }
};
