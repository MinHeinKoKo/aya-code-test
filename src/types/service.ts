import { Document } from "mongoose";

export interface IService extends Document {
  _id: string;
  description: string;
}
