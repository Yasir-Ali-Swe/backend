import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
export const getUserFromToken = async (headers) => {
  if (
    !headers ||
    !headers.authorization ||
    !headers.authorization.startsWith("Bearer ")
  ) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
  const token = headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
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
  const userId = decoded.id;
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};
