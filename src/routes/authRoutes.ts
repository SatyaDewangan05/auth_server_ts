import express, { Router } from 'express';
import { signup, verifyOTP, signIn } from '../controllers/authController';

const router: Router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/signin', signIn);

export default router;
