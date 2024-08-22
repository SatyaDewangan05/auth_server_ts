// authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
      };
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      // Type guard to ensure user is IUser
      if (isIUser(user)) {
        req.user = user;
        next();
      } else {
        throw new Error("Invalid user type");
      }
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Type guard function
function isIUser(user: any): user is IUser {
  return user && typeof user === "object" && "_id" in user;
}
