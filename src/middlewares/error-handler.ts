import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

// Centralized error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error("API Error:", {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    query: req.query,
  });

  // Handle specific error types
  if (
    error.message === "User not found" ||
    error.message === "From user not found" ||
    error.message === "To user not found"
  ) {
    return res.status(404).json({
      error: "NOT_FOUND",
      message: error.message,
    });
  }

  if (error.message === "Insufficient funds") {
    return res.status(400).json({
      error: "INSUFFICIENT_FUNDS",
      message: error.message,
    });
  }

  if (error.message === "Invalid IdempotencyKey") {
    return res.status(400).json({
      error: "INVALID_KEY",
      message: error.message,
    });
  }

  if (error.message === "Self-transfer not allowed") {
    return res.status(400).json({
      error: "INVALID_TRANSFER",
      message: error.message,
    });
  }

  if (error.message === "Insufficient company balance") {
    return res.status(400).json({
      error: "INSUFFICIENT_COMPANY_BALANCE",
      message: error.message,
    });
  }

  // Handle MongoDB duplicate key errors
  if (error.name === "MongoServerError" && (error as any).code === 11000) {
    return res.status(409).json({
      error: "DUPLICATE_REQUEST",
      message: "Request already processed",
    });
  }

  // Default server error
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  });
};
