# Idempotency Logic
The wallet system is required key in the header in two kinds of request such as cash-in and transfer.

## Validate Idempotency Middleware
```typescript
export const validateIdempotencyKey = (
  req: Request,
  res: Response,
  next: NextFunction
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
```

## Getting key from the Request
```typescript
      const request: CashInRequest = req.body;
      const idempotencyKey = req.idempotencyKey!;

      const transaction = await TransactionService.processCashIn(
        request,
        idempotencyKey
      );
```

## Using that key in the Transfer and cash In
```typescript
      const existingTxn = await Transaction.findOne({ idempotencyKey }).session(session);
      if (existingTxn) {
        throw new Error('Invalid IdempotencyKey')
      }
```
