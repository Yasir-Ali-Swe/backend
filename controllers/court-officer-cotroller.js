import caseModel from "../models/case-model.js";
import hearingModel from "../models/hearing-model.js";
import judgmentModel from "../models/judgment-model.js";

export const courtOfficerGetAllTheCase = async (req, res) => {
    try {
        const courtOfficerId = req.userId.toString();
        if (!courtOfficerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const cases = await caseModel.find({ courtOfficerId, status: "active" }).populate("lawyerId").populate("courtId").populate("courtOfficerId");
        if (cases.length === 0) {
            return res.status(404).json({ success: false, message: "No cases found" })
        }
        return res.status(200).json({ success: true, message: "Case fetched successfully", data: cases })
    } catch (error) {
        res.status(500).json({ success: false, message: "Intternal Server Error", error: error.message })
    }
}


export const getActiveCaseById = async (req, res) => {
    try {
        const courtOfficerId = req.userId.toString();
        const { caseId } = req.params;
        if (!caseId) {
            return res.status(400).json({ success: false, message: "caseId is required" })
        }
        const activeCase = await caseModel.findById(caseId).populate("lawyerId").populate("courtId").populate("courtOfficerId");
        if (!activeCase) {
            return res.status(404).json({ success: false, message: "Case not found" })
        }
        if (!activeCase.courtOfficerId || activeCase.courtOfficerId._id.toString() !== courtOfficerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        return res.status(200).json({ success: true, message: "Case fetched successfully", data: activeCase })
    } catch (error) {
        res.status(500).json({ success: false, message: "Intternal Server Error", error: error.message })
    }
}

export const updateCaseStatus = async (req, res) => {
    try {
        const courtOfficerId = req.userId.toString();
        const { caseId } = req.params;
        const { status, judgmentDetails, verdict } = req.body;

        if (!caseId || !status) {
            return res.status(400).json({ success: false, message: "caseId and status are required" });
        }

        const validStatuses = ["pending", "active", "decided", "closed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const caseData = await caseModel.findById(caseId);
        if (!caseData) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        if (!caseData.courtOfficerId || caseData.courtOfficerId.toString() !== courtOfficerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (caseData.status === "decided" || caseData.status === "closed") {
            return res.status(400).json({ success: false, message: "Cannot change status of a decided or closed case" });
        }

        if (status === "decided" || status === "closed") {
            if (!judgmentDetails) {
                return res.status(400).json({ success: false, message: "Judgment details are required for decided or closed cases" });
            }
            // Check if judgment already exists to avoid duplicates if accidentally called
            const existingJudgment = await judgmentModel.findOne({ caseId });
            if (!existingJudgment) {
                await judgmentModel.create({
                    caseId,
                    judgmentDetails,
                    verdict
                });
            }
        }

        caseData.status = status;
        await caseData.save();

        return res.status(200).json({ success: true, message: "Case status updated successfully", data: caseData });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const scheduleHearing = async (req, res) => {
    try {
        const courtOfficerId = req.userId.toString();
        const caseId = req.params.caseId;
        const { date, remarks, status } = req.body;

        if (!caseId || !date || !remarks) {
            return res.status(400).json({ success: false, message: "caseId, date, and remarks are required" });
        }

        // Validate date is not in the past? Optional but good practice.
        // For now, sticking to requirements.

        const hearingData = {
            caseId,
            date,
            remarks,
            updatedBy: courtOfficerId,
            updatedByRole: "court_officer"
        };

        if (status) {
            const validStatuses = ["scheduled", "adjourned", "completed"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid status" });
            }
            hearingData.status = status;
        }

        const caseData = await caseModel.findById(caseId);
        if (!caseData) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        if (!caseData.courtOfficerId || caseData.courtOfficerId.toString() !== courtOfficerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const newHearing = await hearingModel.create(hearingData);

        return res.status(201).json({ success: true, message: "Hearing scheduled successfully", data: newHearing });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const updateHearingStatus = async (req, res) => {
    try {
        const courtOfficerId = req.userId.toString();
        const { hearingId } = req.params;
        const { status } = req.body;

        if (!hearingId || !status) {
            return res.status(400).json({ success: false, message: "hearingId and status are required" });
        }

        const validStatuses = ["scheduled", "adjourned", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const hearing = await hearingModel.findById(hearingId).populate("caseId");
        if (!hearing) {
            return res.status(404).json({ success: false, message: "Hearing not found" });
        }

        // Check authorization via case
        const caseData = hearing.caseId;
        if (!caseData || !caseData.courtOfficerId || caseData.courtOfficerId.toString() !== courtOfficerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        hearing.status = status;
        hearing.updatedBy = courtOfficerId;
        hearing.updatedByRole = "court_officer";
        await hearing.save();

        return res.status(200).json({ success: true, message: "Hearing status updated successfully", data: hearing });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const getAllHearingsForCase = async (req, res) => {
    try {
        const courtOfficerId = req.userId.toString();
        const { caseId } = req.params;

        if (!caseId) {
            return res.status(400).json({ success: false, message: "caseId is required" });
        }

        const caseData = await caseModel.findById(caseId);
        if (!caseData) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        if (!caseData.courtOfficerId || caseData.courtOfficerId.toString() !== courtOfficerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const hearings = await hearingModel.find({ caseId }).sort({ date: 1 });
        return res.status(200).json({ success: true, message: "Hearings fetched successfully", data: hearings });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const makeJudgment = async (req, res) => {
    try {
        const courtOfficerId = req.userId.toString();
        const { caseId } = req.params;
        const { judgmentDetails, verdict } = req.body;

        if (!caseId || !judgmentDetails) {
            return res.status(400).json({ success: false, message: "caseId and judgmentDetails are required" });
        }

        const caseData = await caseModel.findById(caseId);
        if (!caseData) {
            return res.status(404).json({ success: false, message: "Case not found" });
        }

        if (!caseData.courtOfficerId || caseData.courtOfficerId.toString() !== courtOfficerId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (caseData.status === "decided" || caseData.status === "closed") {
            return res.status(400).json({ success: false, message: "Case is already decided or closed" });
        }

        // Check if judgment already exists
        const existingJudgment = await judgmentModel.findOne({ caseId });
        if (existingJudgment) {
            return res.status(400).json({ success: false, message: "Judgment already exists for this case" });
        }

        const newJudgment = await judgmentModel.create({
            caseId,
            judgmentDetails,
            verdict
        });

        caseData.status = "decided";
        await caseData.save();

        return res.status(201).json({ success: true, message: "Judgment created and case decided successfully", data: newJudgment });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};