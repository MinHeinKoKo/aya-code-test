import Joi from "joi";

export const transactionReportSchema = Joi.object({
  transactionId: Joi.string().optional(),
  status: Joi.string().valid("PENDING", "SUCCESS", "FAILED").optional(),
  type: Joi.string().valid("cashin", "transfer").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
