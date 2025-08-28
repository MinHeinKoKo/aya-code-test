import { Router } from "express";
import transactionRoute from "./transaction";
import reportRoute from "./report";
import healthController from "../controllers/health-controller";

const route = Router();

// handle health check
route.get("/health", healthController.healthCheck);

// transaction related route
route.use("/", transactionRoute);

// report related route
route.use("/reports", reportRoute);

export default route;
