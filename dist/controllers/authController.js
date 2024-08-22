"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.verifyOTP = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const Otp_1 = __importDefault(require("../models/Otp"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    yield transporter.sendMail({
        from: '"Satya Dewangan" <testercode404@gmail.com>',
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`,
    });
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("sign up data: ", req.body);
    const { firstName, lastName, email, password } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user && user.verified) {
            res.status(409).json({ message: "User already exists" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log("OTP: ", otp);
        yield sendOTP(email, otp);
        let otpData;
        if (!user) {
            user = new User_1.default({ firstName, lastName, email, password });
            yield user.save();
            otpData = new Otp_1.default({ email, otp });
        }
        else {
            otpData = yield Otp_1.default.findOne({ email });
            if (otpData) {
                otpData.otp = otp;
            }
        }
        if (otpData) {
            yield otpData.save();
        }
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.signup = signup;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const otpData = yield Otp_1.default.findOne({ email });
        const user = yield User_1.default.findOne({ email });
        if (otpData)
            console.log(typeof otpData.otp);
        console.log(typeof Number(otp));
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        else if (otpData && Number(otp) === otpData.otp) {
            user.verified = true; // Non-null assertion, make sure `user` is not null
            yield user.save();
            yield Otp_1.default.deleteOne({ email });
            const JWT_SECRET = process.env.JWT_SECRET; // Type assertion
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: "User verified", token: token });
        }
        else {
            res.status(400).json({ message: "Invalid OTP" });
        }
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.verifyOTP = verifyOTP;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const JWT_SECRET = process.env.JWT_SECRET; // Type assertion
    const { email, password } = req.body;
    console.log("sign In data: ", req.body);
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });
        }
        else {
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res
                    .status(400)
                    .json({ success: false, message: "Invalid email or password" });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ success: true, token });
        }
    }
    catch (error) {
        console.log("error: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.signIn = signIn;
