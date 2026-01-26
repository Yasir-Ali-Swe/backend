import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  adminCompleteProfile,
  getAdminProfile,
  updateAdminProfile,
} from "../controllers/admin.controller.js";

import express from "express";

const router = express.Router();

router.post("/complete-admin-profile", adminMiddleware, adminCompleteProfile);
router.get("/get-admin-profile", adminMiddleware, getAdminProfile);
router.put("/update-admin-profile", adminMiddleware, updateAdminProfile);

export default router;
