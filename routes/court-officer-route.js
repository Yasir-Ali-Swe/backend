import { courtOfficerGetAllTheCase, getActiveCaseById, updateCaseStatus, scheduleHearing, updateHearingStatus, getAllHearingsForCase, makeJudgment } from "../controllers/court-officer-cotroller.js";
import { courtOfficerMiddleware } from "../middlewares/court-officer-middleware.js";
import express from "express";

const router = express.Router();
router.get("/get-all-case", courtOfficerMiddleware, courtOfficerGetAllTheCase);
router.get("/get-active-case/:caseId", courtOfficerMiddleware, getActiveCaseById);
router.put("/update-case-status/:caseId", courtOfficerMiddleware, updateCaseStatus);
router.post("/schedule-hearing/:caseId", courtOfficerMiddleware, scheduleHearing);
router.put("/update-hearing-status/:hearingId", courtOfficerMiddleware, updateHearingStatus);
router.get("/get-hearings/:caseId", courtOfficerMiddleware, getAllHearingsForCase);
router.post("/make-judgment/:caseId", courtOfficerMiddleware, makeJudgment);

export default router;