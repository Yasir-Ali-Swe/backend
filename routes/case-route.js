import { lawyerDraftCase, lawyerUpateTheDraftCase, lawyerDeleteTheDraftCase, lawyerGetTheCaseById, lawyerGetAllTheCase, lawyerSubmitCase } from "../controllers/case-controller.js";
import { lawyerMiddleware } from "../middlewares/lawyer-middleware.js";
import express from "express";

const router = express.Router();
router.post("/draft-case", lawyerMiddleware, lawyerDraftCase);
router.put("/update-draft-case/:caseId", lawyerMiddleware, lawyerUpateTheDraftCase);
router.delete("/delete-draft-case/:caseId", lawyerMiddleware, lawyerDeleteTheDraftCase);
router.get("/get-case/:caseId", lawyerMiddleware, lawyerGetTheCaseById);
router.get("/get-all-case", lawyerMiddleware, lawyerGetAllTheCase);
router.post("/submit-case/:caseId", lawyerMiddleware, lawyerSubmitCase);



export default router;
