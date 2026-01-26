import {
  lawyerCompleteProfile,
  getLawyerProfile,
  updateLawyerProfile,
} from "../controllers/lawyer.profile.contoller.js";
import { lawyerMiddleware } from "../middlewares/lawyer.middleware.js";
import express from "express";

const router = express.Router();

router.post(
  "/complete-lawyer-profile",
  lawyerMiddleware,
  lawyerCompleteProfile,
);
router.get("/get-lawyer-profile", lawyerMiddleware, getLawyerProfile);
router.put("/update-lawyer-profile", lawyerMiddleware, updateLawyerProfile);

export default router;

