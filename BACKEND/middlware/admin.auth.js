import jwt from "jsonwebtoken";
import Admin from "../models/admin.login.js";

// General authentication middleware
export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch admin details from MongoDB
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized: Admin not found" });
    }

    req.user = { id: admin._id, isAdmin: admin.isAdmin };
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};


// Admin-specific middleware
export const isAdmin = (req, res, next) => {
  console.log("Checking Admin:", req.user);

  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

