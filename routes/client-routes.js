import {
  createClientProfile,
  getClientProfile,
  updateClientProfile,
  sendProposal,
  getClientProposals,
} from "../controllers/client-controller.js";
import { clientMiddleware } from "../middlewares/client-middleware.js";
import { isProfileComplete } from "../middlewares/profile-complete-middleware.js";
import express from "express";

const router = express.Router();

router.post("/create-profile", clientMiddleware, createClientProfile);
router.get("/get-profile", clientMiddleware, getClientProfile);
router.put("/update-profile", clientMiddleware, updateClientProfile);
router.post(
  "/send-proposal",
  clientMiddleware,
  isProfileComplete,
  sendProposal
);
router.get("/get-proposals-sent", clientMiddleware, getClientProposals);

export default router;
