import { NextFunction, Request, Response } from "express";
import { CashInRequest, TransferRequest } from "../types/transaction";
import TransactionService from "../services/tansaction-service";
class TransactionController {
  async cashIn(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CashInRequest = req.body;
      const idempotencyKey = req.idempotencyKey!;

      const transaction = await TransactionService.processCashIn(
        request,
        idempotencyKey,
      );

      res.status(201).json({
        transactionId: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        fee: transaction.fee,
        feeType: transaction.feeType,
        status: transaction.status,
      });
    } catch (error) {
      next(error);
    }
  }

  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const request: TransferRequest = req.body;
      const idempotencyKey = req.idempotencyKey!;

      const transaction = await TransactionService.processTransfer(
        request,
        idempotencyKey,
      );

      res.status(201).json({
        transactionId: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        fee: transaction.fee,
        feeType: transaction.feeType,
        status: transaction.status,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
