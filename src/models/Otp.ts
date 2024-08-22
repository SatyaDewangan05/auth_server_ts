import mongoose, { Document, Model, Schema } from "mongoose";

interface IOtp extends Document {
  email: string;
  otp: number;
}

const otpSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
});

const Otp: Model<IOtp> = mongoose.model<IOtp>("OTP", otpSchema);

export default Otp;
