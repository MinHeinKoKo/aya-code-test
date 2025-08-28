import { Request, Response } from "express";
import logger from "../config/logger";
import rateLimit from "express-rate-limit";

const rateLimitHandler = (req: Request, res: Response) => {
  logger.warn("Rate limit exceeded", {
    ip: req.ip,
    url: req.url,
    method: req.method,
    userAgent: req.get("User-Agent"),
  });

  res.status(429).json({
    error: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests. Please try again later.",
    retryAfter: 60,
  });
};

export const generalLimiter = rateLimit({
  windowMs: 60000,
  max: 60,
  message: {
    error: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
