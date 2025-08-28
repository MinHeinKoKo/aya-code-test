import fs from "fs";
import path from "path";

// Getting current date in DD-MM-YYYY format
export const getCurrentDateString = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${day}-${month}-${year}`;
};

// To check log directory exists or not
export const checkLogDirectory = (): void => {
  const dateString = getCurrentDateString();
  const logDir = path.join("logs", dateString);

  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
  }

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

// Creating rotate log file with date
export const createLogPath = (logType: string): string => {
  const dateString = getCurrentDateString();
  return path.join("logs", dateString, `${logType}.log`);
};
