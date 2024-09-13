import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import Otp from "../models/Otp";
import FitUser, { IFitUser } from "../models/FitUsers";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

interface AuthRequest extends Request {
  user?: IUser;
}

const sendOTP = async (email: string, otp: number): Promise<void> => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Satya Dewangan" <testercode404@gmail.com>',
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
  });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  console.log("sign up data: ", req.body);
  const { firstName, lastName, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user && user.verified) {
      res.status(409).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("OTP: ", otp);
    await sendOTP(email, otp);

    let otpData;
    if (!user) {
      user = new User({ firstName, lastName, email, password });
      await user.save();
      otpData = new Otp({ email, otp });
    } else {
      otpData = await Otp.findOne({ email });
      if (otpData) {
        otpData.otp = otp;
      }
    }

    if (otpData) {
      await otpData.save();
    }

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signupFit = async (req: Request, res: Response): Promise<void> => {
  console.log("sign up data: ", req.body);
  const { firstName, lastName, email, password, dateOfBirth, gender } =
    req.body;
  try {
    let user = await FitUser.findOne({ email });
    if (user && user.verified) {
      res.status(409).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("OTP: ", otp);
    await sendOTP(email, otp);

    let otpData;
    if (!user) {
      user = new FitUser({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        gender,
      });
      await user.save();
      otpData = new Otp({ email, otp });
    } else {
      otpData = await Otp.findOne({ email });
      if (otpData) {
        otpData.otp = otp;
      }
    }

    if (otpData) {
      await otpData.save();
    }

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  try {
    const otpData = await Otp.findOne({ email });
    const user = await User.findOne({ email });

    if (otpData) console.log(typeof otpData.otp);
    console.log(typeof Number(otp));

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else if (otpData && Number(otp) === otpData.otp) {
      user!.verified = true; // Non-null assertion, make sure `user` is not null
      await user!.save();
      await Otp.deleteOne({ email });
      const JWT_SECRET = process.env.JWT_SECRET as string; // Type assertion
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "User verified", token: token });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyFitOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, otp } = req.body;
  try {
    const otpData = await Otp.findOne({ email });
    const user = await FitUser.findOne({ email });

    if (otpData) console.log(typeof otpData.otp);
    console.log(typeof Number(otp));

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else if (otpData && Number(otp) === otpData.otp) {
      user!.verified = true; // Non-null assertion, make sure `user` is not null
      await user!.save();
      await Otp.deleteOne({ email });
      const JWT_SECRET = process.env.JWT_SECRET as string; // Type assertion
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: "User verified", token: token });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const JWT_SECRET = process.env.JWT_SECRET as string; // Type assertion
  const { email, password } = req.body;
  console.log("sign In data: ", req.body);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ success: true, token });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const signInFit = async (req: Request, res: Response): Promise<void> => {
  const JWT_SECRET = process.env.JWT_SECRET as string; // Type assertion
  const { email, password } = req.body;
  console.log("sign In data: ", req.body);

  try {
    const user = await FitUser.findOne({ email });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ success: true, token });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
