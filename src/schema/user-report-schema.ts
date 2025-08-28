import Joi from "joi";

export const userReportSchema = Joi.object({
  phone: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});
