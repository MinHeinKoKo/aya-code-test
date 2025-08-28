import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  phone: string;
  balance: number;
  createdAt: Date;
}

export interface UserReportItem {
  userId: string;
  name: string;
  phone: string;
  balance: number;
  totalCreditFee: number;
  totalDebitFee: number;
}
