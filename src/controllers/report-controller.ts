import { Request, Response, NextFunction } from "express";
import ReportService from "../services/report-service";

class ReportController {
  async userReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, page, limit } = req.query as any;

      const result = await ReportService.getUserReports(phone, page, limit);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async transactionReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId, status, type, page, limit } = req.query as any;

      const result = await ReportService.getTransactionReports(
        transactionId,
        status,
        type,
        page,
        limit,
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
