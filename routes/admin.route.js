import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  adminCompleteProfile,
  getAdminProfile,
  updateAdminProfile,
  adminCreateCourt,
  getAllCourts,
  adminGetCourtById,
  adminCreateInternalUsers,
  adminGetInternalUsers,
  adminGetInternalUserById,
  adminAssigneClerkToCourt,
  adminGetClerkProfiles,
  adminGetClerkProfile,
} from "../controllers/admin.controller.js";

import express from "express";

const router = express.Router();

router.post("/complete-admin-profile", adminMiddleware, adminCompleteProfile);
router.get("/get-admin-profile", adminMiddleware, getAdminProfile);
router.put("/update-admin-profile", adminMiddleware, updateAdminProfile);
router.post("/admin-create-court", adminMiddleware, adminCreateCourt);
router.get("/admin-get-courts", adminMiddleware, getAllCourts);
router.get("/admin-get-court/:id", adminMiddleware, adminGetCourtById);
router.post(
  "/admin-create-internal-user",
  adminMiddleware,
  adminCreateInternalUsers,
);
router.get("/admin-get-internal-users", adminMiddleware, adminGetInternalUsers);
router.get(
  "/admin-get-user-by-id/:id",
  adminMiddleware,
  adminGetInternalUserById,
);
router.put("/admin-assigne-Clerk", adminMiddleware, adminAssigneClerkToCourt);
router.get(
  "/admin-get-clerk-profile/:clerkId",
  adminMiddleware,
  adminGetClerkProfiles,
);

router.get("/admin-get-clerk-profiles", adminMiddleware, adminGetClerkProfile);

export default router;
