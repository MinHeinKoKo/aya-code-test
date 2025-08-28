# Atomicity & Concurrency Control
The wallet transfer transaction are done with the MongoDB transactions and currency control mechanisms.

## Approach with Session Managment

```typescript
  async processCashIn(request: CashInRequest, idempotencyKey: string) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Check for existing transaction with same idempotency key
      const existingTxn = await Transaction.findOne({ idempotencyKey }).session(session);
      if (existingTxn) {
        throw new Error('Invalid IdempotencyKey')
      }

      // Validate user exists
      const user = await User.findById(request.userId).session(session);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate fee
      const fee = await FeeService.calculateFee('cashin', request.amount);
      const netAmount = request.amount - fee;

      // Get company
      const company = await Company.findById('company').session(session);
      if (!company) {
        throw new Error('Company not found');
      }

      // Check company has sufficient balance
      if (company.balance < request.amount) {
        throw new Error('Insufficient company balance');
      }

      // Create transaction record
      const transaction = new Transaction({
        type: 'cashin',
        fromAccountType: 'company',
        fromCompanyId: 'company',
        toAccountType: 'user',
        toUserId: request.userId,
        amount: request.amount,
        fee,
        feeType: 'credit',
        companyDelta: -request.amount + fee,
        status: 'SUCCESS',
        idempotencyKey,
      });

      // Update balances in users
      await User.findByIdAndUpdate(request.userId, { $inc: { balance: netAmount } }, { session });

      // Update balance of company
      await Company.findByIdAndUpdate('company', { $inc: { balance: -request.amount + fee } }, { session });

      await transaction.save({ session });

      // commit transaction
      await session.commitTransaction();

      // logging the success cash in
      logger.info('Cash in processed successfully', {
        transactionId: transaction._id,
        userId: request.userId,
        amount: request.amount,
        fee,
        netAmount,
      });

      return transaction;
    } catch (error) {
      await session.abortTransaction();
      logger.error('Cash in failed', { error: error instanceof Error ? error.message : String(error), request });
      throw error;
    } finally {
      session.endSession();
    }
  }
```
