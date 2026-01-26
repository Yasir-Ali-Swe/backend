import {
  completeUserProfile,
  getClientProfile,
  updateClientProfile,
} from "../controllers/client.profile.controller.js";
import { clientMiddleware } from "../middlewares/client.middleware.js";
import express from "express";

const router = express.Router();

router.post("/complete-client-profile", clientMiddleware, completeUserProfile);
router.get("/get-client-profile", clientMiddleware, getClientProfile);
router.put("/update-client-profile", clientMiddleware, updateClientProfile);
export default router;
