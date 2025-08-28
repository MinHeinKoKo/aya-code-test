import Joi from "joi";

export const cashInSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().integer().min(1).required(),
});
