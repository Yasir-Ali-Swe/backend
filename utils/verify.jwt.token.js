import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const getUserFromToken = async (token, expectedPurpose = "auth") => {
  if (!token) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      const error = new Error("Invalid or expired token");
      error.status = 401;
      throw error;
    }
    throw err;
  }

  if (decoded.purpose !== expectedPurpose) {
    const error = new Error("Invalid token purpose");
    error.status = 401;
    throw error;
  }

  const user = await userModel.findById(decoded.id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  // Check tokenVersion for auth tokens
  if (expectedPurpose === "auth" && decoded.tokenVersion !== user.tokenVersion) {
    const error = new Error("Token revoked");
    error.status = 401;
    throw error;
  }

  return user;
};

