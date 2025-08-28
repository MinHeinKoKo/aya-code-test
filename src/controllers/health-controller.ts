import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

class HealthController {
  async healthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const dbStatus = mongoose.connection.readyState === 1 ? "ok" : "error";
      const uptime = process.uptime();
      const timestamp = new Date().toISOString();

      if (dbStatus === "error") {
        res.status(503).json({
          status: "error",
          uptime,
          timestamp,
          database: dbStatus,
          message: "Database connection failed",
        });
      } else {
        res.status(200).json({
          status: "ok",
          uptime,
          timestamp,
          database: dbStatus,
        });
      }
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({
        status: "error",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "ok" : "error",
        message: "Internal server error during health check",
      });
    }
  }
}

export default new HealthController();
