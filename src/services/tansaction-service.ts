import mongoose from "mongoose";
import Transaction from "../models/transaction";
import User from "../models/user";
import Company from "../models/company";
import FeeService from "./fee-service";
import logger from "../config/logger";
import { CashInRequest, TransferRequest } from "../types/transaction";

class TransactionService {
  async processCashIn(request: CashInRequest, idempotencyKey: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Check for existing transaction with same idempotency key
      const existingTxn = await Transaction.findOne({ idempotencyKey }).session(
        session,
      );
      if (existingTxn) {
        throw new Error("Invalid IdempotencyKey");
      }

      // Validate user exists
      const user = await User.findById(request.userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }

      // Calculate fee
      const fee = await FeeService.calculateFee("cashin", request.amount);
      const netAmount = request.amount - fee;

      // Get company
      const company = await Company.findById("company").session(session);
      if (!company) {
        throw new Error("Company not found");
      }

      // Check company has sufficient balance
      if (company.balance < request.amount) {
        throw new Error("Insufficient company balance");
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "cashin",
        fromAccountType: "company",
        fromCompanyId: "company",
        toAccountType: "user",
        toUserId: request.userId,
        amount: request.amount,
        fee,
        feeType: "credit",
        companyDelta: -request.amount + fee,
        status: "SUCCESS",
        idempotencyKey,
      });

      // Update balances in users
      await User.findByIdAndUpdate(
        request.userId,
        { $inc: { balance: netAmount } },
        { session },
      );

      // Update balance of company
      await Company.findByIdAndUpdate(
        "company",
        { $inc: { balance: -request.amount + fee } },
        { session },
      );

      await transaction.save({ session });

      // commit transaction
      await session.commitTransaction();

      // logging the success cash in
      logger.info("Cash in processed successfully", {
        transactionId: transaction._id,
        userId: request.userId,
        amount: request.amount,
        fee,
        netAmount,
      });

      return transaction;
    } catch (error) {
      await session.abortTransaction();
      logger.error("Cash in failed", {
        error: error instanceof Error ? error.message : String(error),
        request,
      });
      throw error;
    } finally {
      session.endSession();
    }
  }

  async processTransfer(request: TransferRequest, idempotencyKey: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Check for existing transaction with same idempotency key
      const existingTxn = await Transaction.findOne({ idempotencyKey }).session(
        session,
      );
      if (existingTxn) {
        throw new Error("Invalid IdempotencyKey");
      }

      // Validate users exist and not same
      if (request.fromUserId === request.toUserId) {
        throw new Error("Self-transfer not allowed");
      }

      const [fromUser, toUser] = await Promise.all([
        User.findById(request.fromUserId).session(session),
        User.findById(request.toUserId).session(session),
      ]);

      if (!fromUser) {
        throw new Error("From user not found");
      }
      if (!toUser) {
        throw new Error("To user not found");
      }

      // Calculate fee
      const fee = await FeeService.calculateFee("transfer", request.amount);
      const totalDebit = request.amount + fee;

      // Check sender has sufficient balance
      if (fromUser.balance < totalDebit) {
        throw new Error("Insufficient funds");
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "transfer",
        fromAccountType: "user",
        fromUserId: request.fromUserId,
        toAccountType: "user",
        toUserId: request.toUserId,
        amount: request.amount,
        fee,
        feeType: "debit",
        companyDelta: fee,
        status: "SUCCESS",
        idempotencyKey,
      });

      // Update balances
      await User.findByIdAndUpdate(
        request.fromUserId,
        { $inc: { balance: -totalDebit } },
        { session },
      );

      await User.findByIdAndUpdate(
        request.toUserId,
        { $inc: { balance: request.amount } },
        { session },
      );

      await Company.findByIdAndUpdate(
        "company",
        { $inc: { balance: fee } },
        { session },
      );

      await transaction.save({ session });
      await session.commitTransaction();

      logger.info("Transfer processed successfully", {
        transactionId: transaction._id,
        fromUserId: request.fromUserId,
        toUserId: request.toUserId,
        amount: request.amount,
        fee,
        totalDebit,
      });

      return transaction;
    } catch (error) {
      await session.abortTransaction();
      logger.error("Transfer failed", {
        error: error instanceof Error ? error.message : String(error),
        request,
      });
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default new TransactionService();
