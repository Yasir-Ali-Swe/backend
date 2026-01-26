import {
  completeUserProfile,
  getClientProfile,
  updateClientProfile,
} from "../controllers/client.profile.controller.js";
import { lawyerMiddleware } from "../middlewares/lawyer.middleware.js";
import express from "express";

const router = express.Router();

router.post("/complete-lawyer-profile", lawyerMiddleware, completeUserProfile);
router.get("/get-lawyer-profile", lawyerMiddleware, getClientProfile);
router.put("/update-lawyer-profile", lawyerMiddleware, updateClientProfile);

export default router;
