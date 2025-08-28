import { Router } from "express";
import { transactionReportSchema } from "./../schema/transaction-report-schema";
import { validateQuery } from "../middlewares/validate/validate-query";
import { userReportSchema } from "../schema/user-report-schema";
import ReportController from "../controllers/report-controller";

const route = Router();

//handle user reports
route.get(
  "/users",
  validateQuery(userReportSchema),
  ReportController.userReport,
);

//handle transaction reports
route.get(
  "/transactions",
  validateQuery(transactionReportSchema),
  ReportController.transactionReport,
);

export default route;
