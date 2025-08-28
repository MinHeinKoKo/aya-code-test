import { Router } from "express";
import { validateIdempotencyKey } from "../middlewares/validate/validate-idempotency-key";
import { validateBody } from "../middlewares/validate/validate-request";
import { cashInSchema } from "../schema/cash-in-schema";
import TransactionController from "../controllers/transaction-controller";
import { transferSchema } from "../schema/transfer-schema";

const route = Router();

// handle cash-in request
route.post(
  "/cash-in",
  validateIdempotencyKey,
  validateBody(cashInSchema),
  TransactionController.cashIn,
);

// handle transfer request
route.post(
  "/transfers",
  validateIdempotencyKey,
  validateBody(transferSchema),
  TransactionController.transfer,
);

export default route;
