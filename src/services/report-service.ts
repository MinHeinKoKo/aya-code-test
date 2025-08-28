import mongoose from "mongoose";
import User from "../models/user";
import Transaction from "../models/transaction";
import { UserReportItem } from "../types/user";
import { TransactionReportItem } from "../types/transaction";
import { PaginatedResponse } from "../types/paginate";

class ReportService {
  async getUserReports(
    phone?: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<UserReportItem>> {
    const skip = (page - 1) * limit;
    const filter = phone ? { phone } : {};

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    const userReports = await Promise.all(
      users.map(async (user) => {
        const [creditFeeResult, debitFeeResult] = await Promise.all([
          Transaction.aggregate([
            {
              $match: {
                toUserId: user._id,
                feeType: "credit",
                status: "SUCCESS",
              },
            },
            {
              $group: {
                _id: null,
                totalCreditFee: { $sum: "$fee" },
              },
            },
          ]),
          Transaction.aggregate([
            {
              $match: {
                fromUserId: user._id,
                feeType: "debit",
                status: "SUCCESS",
              },
            },
            {
              $group: {
                _id: null,
                totalDebitFee: { $sum: "$fee" },
              },
            },
          ]),
        ]);

        return {
          userId: user._id.toString(),
          name: user.name,
          phone: user.phone,
          balance: user.balance,
          totalCreditFee: creditFeeResult[0]?.totalCreditFee || 0,
          totalDebitFee: debitFeeResult[0]?.totalDebitFee || 0,
        };
      }),
    );

    return {
      items: userReports,
      page,
      limit,
      total,
    };
  }

  async getTransactionReports(
    transactionId?: string,
    status?: "PENDING" | "SUCCESS" | "FAILED",
    type?: "cashin" | "transfer",
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<TransactionReportItem>> {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (transactionId) {
      filter._id = transactionId;
    }
    if (status) {
      filter.status = status;
    }
    if (type) {
      filter.type = type;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate("fromUserId", "name phone")
        .populate("toUserId", "name phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    const transactionReports: TransactionReportItem[] = transactions.map(
      (txn) => ({
        transactionId: (txn._id as mongoose.Types.ObjectId).toString(),
        type: txn.type,
        fromUserId: txn.fromUserId?.toString(),
        toUserId: txn.toUserId?.toString(),
        amount: txn.amount,
        fee: txn.fee,
        feeType: txn.feeType,
        status: txn.status,
        createdAt: txn.createdAt,
      }),
    );

    return {
      items: transactionReports,
      page,
      limit,
      total,
    };
  }
}

export default new ReportService();
