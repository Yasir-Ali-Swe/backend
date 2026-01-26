import UserBaseModel from "../models/user-base-model.js";
import { generateJWT, getUserFromToken } from "../utils/make-jwt.js";
import { sendVerificationEmail } from "../utils/verification-email.js";
import { hashPassword, comparePassword } from "../utils/hash-password.js";

export const registeration = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const existingUser = await UserBaseModel.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        message: "User already registered and verified",
        success: false,
      });
    }
    if (existingUser && !existingUser.isVerified) {
      const token = generateJWT(
        existingUser._id,
        "15m",
        "emailVerification",
        existingUser.tokenVersion,
      );
      await sendVerificationEmail(email, token);
      return res.status(200).json({
        message: "Verification email resent. Please verify your email.",
        success: true,
      });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new UserBaseModel({
      fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = generateJWT(
      newUser._id,
      "15m",
      "emailVerification",
      newUser.tokenVersion,
    );
    await sendVerificationEmail(email, token);
    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required", success: false });
    }
    const user = await getUserFromToken(token, "emailVerification");
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email is already verified", success: false });
    }
    user.isVerified = true;
    await user.save();
    res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", success: false });
    }
    const user = await UserBaseModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid email or password", success: false });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }
    const authToken = generateJWT(user._id, "7d", "auth", user.tokenVersion);
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      success: true,
      token: authToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const logout = async (req, res) => {
  try {
    const { email } = req.params;
    const authToken = req.cookies.authToken;
    if (!authToken) {
      return res
        .status(400)
        .json({ message: "No active session found", success: false });
    }
    const user = await getUserFromToken(authToken, "auth");
    if (user.email !== email) {
      return res
        .status(403)
        .json({ message: "Unauthorized logout attempt", success: false });
    }
    user.tokenVersion += 1;
    await user.save();
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
