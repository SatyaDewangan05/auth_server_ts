// userRoutes.ts
import express, { Response, Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import User, { IUser } from "../models/User";

interface AuthRequest extends express.Request {
  user?: IUser;
}

const router: Router = express.Router();

router.get(
  "/welcome",
  protect,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = req.user; // User is already attached by the protect middleware

      if (!user) {
        res.status(401).json({ success: false, message: "User not found" });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

export default router;
