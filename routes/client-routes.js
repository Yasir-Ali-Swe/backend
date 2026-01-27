import {
  createClientProfile,
  getClientProfile,
  updateClientProfile,
} from "../controllers/client-controller.js";
import { clientMiddleware } from "../middlewares/client-middleware.js";
import express from "express";

const router = express.Router();

router.post("/create-profile", clientMiddleware, createClientProfile);
router.get("/get-profile", clientMiddleware, getClientProfile);
router.put("/update-profile", clientMiddleware, updateClientProfile);

export default router;
