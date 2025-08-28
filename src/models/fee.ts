import mongoose, { Schema } from "mongoose";
import { IFee, IFeeTier } from "../types/fee";

const feeTierSchema = new Schema<IFeeTier>(
  {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const feeSchema = new Schema<IFee>({
  service: {
    type: String,
    required: true,
  },
  tiers: [feeTierSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IFee>("Fee", feeSchema);
