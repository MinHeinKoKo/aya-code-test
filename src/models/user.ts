import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user";

const userSchema = new Schema<IUser>({
  _id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<IUser>("User", userSchema);
