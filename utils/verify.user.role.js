import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const verifyUserRole = async (token, requiredRole) => {
  try {
    if (!token) {
      const error = new Error("Unauthorized for this action or you are not logged in");
      error.status = 401;
      throw error;
    }

    let decoded;
    decoded = jwt.verify(token, JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (user.role !== requiredRole) {
      const error = new Error("You are not authorized to perform this action");
      error.status = 403;
      throw error;
    }
    return user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const err = new Error("Invalid or expired token");
      err.status = 401;
      throw err;
    }
    throw error;
  }
};
