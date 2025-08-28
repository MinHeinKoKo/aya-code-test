import Joi from "joi";

export const transferSchema = Joi.object({
  fromUserId: Joi.string().required(),
  toUserId: Joi.string().required(),
  amount: Joi.number().integer().min(1).required(),
});
