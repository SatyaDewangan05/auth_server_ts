import express, { Router } from "express";
import {
  signup,
  verifyOTP,
  signIn,
  signupFit,
  verifyFitOTP,
  signInFit,
} from "../controllers/authController";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/signupfit", signupFit);
router.post("/verify-otp", verifyOTP);
router.post("/verifyfit-otp", verifyFitOTP);
router.post("/signin", signIn);
router.post("/signinfit", signInFit);

export default router;
