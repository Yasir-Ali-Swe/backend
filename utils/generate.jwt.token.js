import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const generateJwtToken = (userId, expiredAt, purpose = "auth", tokenVersion = 0) => {
  return jwt.sign({ id: userId, purpose, tokenVersion }, JWT_SECRET, { expiresIn: expiredAt });
};

