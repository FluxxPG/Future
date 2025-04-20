import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Augment Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// In a real application, this would use JWT or some other token-based authentication
// For now, we'll just assume the user ID is passed in the header
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user ID from header (this is for demo purposes only)
    const userId = parseInt(req.headers["x-user-id"] as string);
    
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    // Attach user to request object
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First use the regular auth middleware
    authMiddleware(req, res, () => {
      // Then check if the user is an admin
      if (req.user && req.user.role === "admin") {
        next();
      } else {
        return res.status(403).json({ message: "Admin access required" });
      }
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
