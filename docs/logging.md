# Logging Logic
The application is logging using winston for all request with method and valid time format and using date (DD:MM:YYYY) folder structure to categorize the logs

## Code Approach
```typescript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "aya-wallet-mini-system" },
  transports: [
    new winston.transports.File({ filename: createLogPath("error"), level: "error" }),
    new winston.transports.File({ filename: createLogPath("combined")}),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;

```

## Log Util
```typescript
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
```

## The Result
```typescript
{"level":"info","message":"Server running on port 8000","service":"aya-wallet-mini-system","timestamp":"2025-08-28T04:47:36.001Z"}
{"level":"info","message":"Connected to MongoDB for seeding","service":"aya-wallet-mini-system","timestamp":"2025-08-28T04:47:45.307Z"}
{"level":"info","message":"Database seeded successfully","service":"aya-wallet-mini-system","timestamp":"2025-08-28T04:47:45.384Z"}
{"level":"info","message":"Seeded data:","service":"aya-wallet-mini-system","timestamp":"2025-08-28T04:47:45.385Z"}
{"level":"info","message":"- Company with balance: 10,000,000 MMK","service":"aya-wallet-mini-system","timestamp":"2025-08-28T04:47:45.385Z"}
{"level":"info","message":"- 8 users with 0 balance","service":"aya-wallet-mini-system","timestamp":"2025-08-28T04:47:45.385Z"}

```
