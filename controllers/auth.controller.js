import userModel from "../models/user.model.js";
import { generateJwtToken } from "../utils/generate.jwt.token.js";
import { sendVerificationEmail } from "../utils/send.verification.email.js";
import { hashPassword, comparePassword } from "../utils/hash.password.js";
import { getUserFromToken } from "../utils/verify.jwt.token.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await userModel.findOne({ email });

    if (userExist && userExist.isVerified) {
      return res.status(409).json({ message: "User already exists" });
    }

    if (userExist && !userExist.isVerified) {
      const userId = userExist._id;
      const token = generateJwtToken(userId, 15 * 60); // 15 minutes
      await sendVerificationEmail(email, token);
      return res.status(200).json({
        message:
          "You are already registerd so Verification email resent. Please verify your email.",
      });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const userId = savedUser._id;
    const token = generateJwtToken(userId, 15 * 60); // 15 minutes
    await sendVerificationEmail(email, token);
    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      token,
    });
  } catch (error) {
    console.log("Error in register:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers);
    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message: "Verification token has expired. Please register again.",
      });
    }

    console.log("Error in verifyEmail:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!userExist.isVerified) {
      return res.status(401).json({
        message:
          "Please verify your email first by repeating the registration process.",
      });
    }
    const isPasswordMatch = await comparePassword(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const userId = userExist._id;
    const token = generateJwtToken(userId, "1h");

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log("Error in login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserFromToken(req.headers);
    if (user.email !== email) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(email);
    user.tokenVersion++;
    await user.save();
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Error in logout:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
