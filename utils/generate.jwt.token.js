import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const generateJwtToken = (userId, expiredAt) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: expiredAt });
};


