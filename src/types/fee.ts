import { Document } from "mongoose";

export interface IFeeTier {
  min: number;
  max: number | null;
  type: "percent" | "fixed";
  value: number;
}

export interface IFee extends Document {
  service: string;
  tiers: IFeeTier[];
  updatedAt: Date;
}
