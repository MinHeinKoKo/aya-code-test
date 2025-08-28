import { Document } from "mongoose";

export interface ICompany extends Document {
  _id: string;
  balance: number;
  createdAt: Date;
}
