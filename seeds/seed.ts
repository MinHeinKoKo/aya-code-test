import dotenv from "dotenv";
import mongoose from "mongoose";
import Company from "../src/models/company";
import User from "../src/models/user";
import Service from "../src/models/service";
import Fee from "../src/models/fee";
import logger from "../src/config/logger";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info("Connected to MongoDB for seeding");

    // Firstly, Clear existing data
    await Promise.all([
      Company.deleteMany({}),
      User.deleteMany({}),
      Service.deleteMany({}),
      Fee.deleteMany({}),
    ]);

    // Seed Company
    await Company.create({
      _id: "company",
      balance: 10000000,
    });

    // Seed Users
    const users = [
      { name: "Aye Aye", phone: "09123456789" },
      { name: "Hla Hla", phone: "09987654321" },
      { name: "Mya Mya", phone: "09111222333" },
      { name: "Kyaw Kyaw", phone: "09444555666" },
      { name: "Thida", phone: "09777888999" },
      { name: "Zaw Zaw", phone: "09333444555" },
      { name: "Kyaw Gyi", phone: "09666777888" },
      { name: "Wai Wai", phone: "09222333444" },
    ];

    await User.insertMany(users);

    // Seed Services
    await Service.insertMany([
      { _id: "cashin", description: "Cash In from company to user" },
      { _id: "transfer", description: "Transfer between users" },
    ]);

    // Seed Fee configurations
    await Fee.insertMany([
      {
        service: "cashin",
        tiers: [
          { min: 0, max: 100000, type: "percent", value: 0 },
          { min: 100001, max: null, type: "percent", value: 0.001 },
        ],
      },
      {
        service: "transfer",
        tiers: [
          { min: 0, max: 100000, type: "fixed", value: 0 },
          { min: 100001, max: 500000, type: "fixed", value: 100 },
          { min: 500001, max: null, type: "fixed", value: 200 },
        ],
      },
    ]);

    logger.info("Database seeded successfully");
    logger.info("Seeded data:");
    logger.info("- Company with balance: 10,000,000 MMK");
    logger.info(`- ${users.length} users with 0 balance`);
    logger.info("- 2 services (cashin, transfer)");
    logger.info("- Fee configurations for both services");
  } catch (error) {
    logger.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();
