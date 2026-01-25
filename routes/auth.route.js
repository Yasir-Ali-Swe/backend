import {
  register,
  verifyEmail,
  login,
  logout,
} from "../controllers/auth.controller.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout/:email", logout);

export default router;
