import { createProfile, adminUpdateHisProfile, adminGetHisProfile, adminCreateInternalUser, adminCreateCourt, getAllCourts, getCourtById, adminGetAllInternalUsers, adminGetInternalUserById, adminAssigneClerkToCourt, getClerkProfile } from "../controllers/admin-controller.js";
import { adminMiddleware } from "../middlewares/admin-middleware.js";
import express from "express";

const router = express.Router();

//admin Routes
router.post("/create-profile", adminMiddleware, createProfile);
router.put("/update-profile", adminMiddleware, adminUpdateHisProfile);
router.get("/get-profile", adminMiddleware, adminGetHisProfile);

//Court Routes
router.post("/create-court", adminMiddleware, adminCreateCourt);
router.get("/get-all-courts", adminMiddleware, getAllCourts);
router.get("/get-court/:courtId", adminMiddleware, getCourtById);


//admin internal user routes
router.post("/create-internal-user", adminMiddleware, adminCreateInternalUser);
router.get("/get-internal-users", adminMiddleware, adminGetAllInternalUsers)
router.get("/get-internal-user/:internalUserId", adminMiddleware, adminGetInternalUserById)
router.post("/assign-clerk-to-court", adminMiddleware, adminAssigneClerkToCourt)
router.get("/get-clerk-profile/:userId", adminMiddleware, getClerkProfile)

export default router;
