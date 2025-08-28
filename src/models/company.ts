import mongoose, { Schema } from "mongoose";
import { ICompany } from "../types/company";

const companySchema = new Schema<ICompany>({
  _id: {
    type: String,
    required: true,
    default: "company",
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model<ICompany>("Company", companySchema);
