import { lawyerDraftCase, lawyerUpateTheDraftCase, lawyerDeleteTheDraftCase, lawyerGetTheCaseById, lawyerGetAllTheCase, lawyerSubmitCase, clerkGetSubmitedCases, clerkRegisterCase } from "../controllers/case-controller.js";
import { lawyerMiddleware } from "../middlewares/lawyer-middleware.js";
import { clerkMiddleware } from "../middlewares/clerk-middleware.js";
import express from "express";

const router = express.Router();
router.post("/draft-case", lawyerMiddleware, lawyerDraftCase);
router.put("/update-draft-case/:caseId", lawyerMiddleware, lawyerUpateTheDraftCase);
router.delete("/delete-draft-case/:caseId", lawyerMiddleware, lawyerDeleteTheDraftCase);
router.get("/get-case/:caseId", lawyerMiddleware, lawyerGetTheCaseById);
router.get("/get-all-case", lawyerMiddleware, lawyerGetAllTheCase);
router.post("/submit-case/:caseId", lawyerMiddleware, lawyerSubmitCase);
router.get("/get-submited-cases", clerkMiddleware, clerkGetSubmitedCases);
router.post("/register-case/:caseId", clerkMiddleware, clerkRegisterCase);


export default router;
