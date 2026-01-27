import {
  createLawyerInfo,
  getLawyerInfo,
  updateLawyerInfo,
  createLawyerProfile,
  getLawyerProfile,
  updateLawyerProfile,
  updateProposalStatus,
  getLawyerProposals,
} from "../controllers/lawyer-controller.js";
import express from "express";
import { lawyerMiddleware } from "../middlewares/lawyer-middleware.js";

const router = express.Router();

router.post("/create-info", lawyerMiddleware, createLawyerInfo);
router.get("/get-info", lawyerMiddleware, getLawyerInfo);
router.put("/update-info", lawyerMiddleware, updateLawyerInfo);
router.post("/create-lawyer-profile", lawyerMiddleware, createLawyerProfile);
router.get("/get-lawyer-profile", lawyerMiddleware, getLawyerProfile);
router.put("/update-lawyer-profile", lawyerMiddleware, updateLawyerProfile);
router.put(
  "/update-proposal-status",
  lawyerMiddleware,
  updateProposalStatus
);
router.get("/get-proposals-received", lawyerMiddleware, getLawyerProposals);

export default router;
