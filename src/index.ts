// Load environment variables FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import logger from "./config/logger";
import route from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { connectMongo } from "./config/database";
import { generalLimiter } from "./middlewares/rate-limiter";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON requests
app.use(express.json());

// console.log("The rate max : ", process.env.RATE_LIMIT_MAX)

// Rate Limit Middleware for all request
app.use(generalLimiter);

//logging middleware
app.use((req, res, next) => {
  logger.info("API Request", {
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
    headers: {
      "idempotency-key": req.headers["idempotency-key"],
    },
  });
  next();
});

//setup routes
app.use("/api/v1", route);

// handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Route not found",
  });
});

// Error handling
app.use(errorHandler);

//start the server
const startServer = async () => {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
