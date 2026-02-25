import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Accept token from cookie (preferred) or Authorization header as fallback
    let token = req.cookies?.jwt;
    const authHeader = req.headers?.authorization;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 🔴 If no token → user simply not logged in
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    // 🔥 CRITICAL: NEVER return 500 for auth
    return res.status(401).json({ message: "Not authorized" });
  }
};
