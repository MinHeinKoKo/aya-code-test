import winston from "winston";
import { checkLogDirectory, createLogPath } from "../utils/log-utils";

// Check log directory exist
checkLogDirectory();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "aya-wallet-mini-system" },
  transports: [
    new winston.transports.File({
      filename: createLogPath("error"),
      level: "error",
    }),
    new winston.transports.File({ filename: createLogPath("combined") }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

export default logger;
