import mongoose from "mongoose";
import logger from "./logger";

//connect to MongoDB
export const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/wallet-mini-system",
    );

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);

    process.exit(1);
  }
};
