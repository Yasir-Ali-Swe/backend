import { verifyUserRole } from "../utils/verify.user.role.js";

export const clientMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.loginCookie;
    const user = await verifyUserRole(token, "client");
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.log("Error in client middleware:", error.message);
    res.status(error.status || 500).json({ message: "Internal Server Error" });
  }
};
