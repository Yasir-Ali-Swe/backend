import { verifyUserRole } from "../utils/verify.user.role.js";

export const lawyerMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.loginCookie;
    const user = await verifyUserRole(token, "lawyer");
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.log("Error in lawyer middleware:", error.message);
    res.status(error.status || 500).json({ message: "Internal Server Error" });
  }
};
