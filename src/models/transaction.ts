import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../types/transaction";

const transactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ["cashin", "transfer"],
    required: true,
  },
  fromAccountType: {
    type: String,
    enum: ["company", "user"],
    required: true,
  },
  fromCompanyId: {
    type: String,
    default: null,
  },
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  toAccountType: {
    type: String,
    enum: ["company", "user"],
    required: true,
  },
  toCompanyId: {
    type: String,
    default: null,
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  fee: {
    type: Number,
    required: true,
    min: 0,
  },
  feeType: {
    type: String,
    enum: ["credit", "debit"],
    required: true,
  },
  companyDelta: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  idempotencyKey: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
