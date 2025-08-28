import { Request, Response, NextFunction } from "express";

export const validateIdempotencyKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const idempotencyKey = req.headers["idempotency-key"] as string;
  if (!idempotencyKey) {
    return res.status(400).json({
      error: "Idempotency-Key header is required",
    });
  }
  req.idempotencyKey = idempotencyKey;
  next();
};

declare global {
  namespace Express {
    interface Request {
      idempotencyKey?: string;
    }
  }
}
