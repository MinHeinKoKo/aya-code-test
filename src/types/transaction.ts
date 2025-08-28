import { Document } from "mongoose";

export interface ITransaction extends Document {
  type: "cashin" | "transfer";
  fromAccountType: "company" | "user";
  fromCompanyId?: string;
  fromUserId?: string;
  toAccountType: "company" | "user";
  toCompanyId?: string;
  toUserId?: string;
  amount: number;
  fee: number;
  feeType: "credit" | "debit";
  companyDelta: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  idempotencyKey: string;
  createdAt: Date;
}

export interface TransactionReportItem {
  transactionId: string;
  type: "cashin" | "transfer";
  fromUserId?: string;
  toUserId?: string;
  amount: number;
  fee: number;
  feeType: "credit" | "debit";
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
}

export interface CashInRequest {
  userId: string;
  amount: number;
}

export interface TransferRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
}
