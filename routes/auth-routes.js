import express from "express";
import {
  registeration,
  verifyEmail,
  login,
  logout,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.post("/register", registeration);
router.post("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout/:email", logout);
export default router;
