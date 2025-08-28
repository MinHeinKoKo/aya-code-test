import mongoose, { Schema } from "mongoose";
import { IService } from "../types/service";

const serviceSchema = new Schema<IService>({
  _id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IService>("Service", serviceSchema);
