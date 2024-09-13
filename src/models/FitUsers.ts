import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IFitUser extends Document {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  verified: boolean;
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

userSchema.pre<IFitUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const FitUser: Model<IFitUser> = mongoose.model<IFitUser>(
  "FitUser",
  userSchema
);

export default FitUser;
