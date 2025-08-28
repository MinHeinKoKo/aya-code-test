# Transfer Logic
The transfer logic make to transfer from one user to one user by validating all the related information like before transfer the user who want to transfer has the enought balance to make this.

# Approach

1. check exit transaction or not by using "IdempotencyKey"
   ```typescript
      const existingTxn = await Transaction.findOne({ idempotencyKey }).session(
        session
      );
      if (existingTxn) {
        await session.abortTransaction();
        return existingTxn;
      }
   ```
2. check User is valide or not and make sure the user isn't the same to the transfer user
   ```typescript
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
   ```
3. calculate fee
   ```typescript
      // Calculate fee
      const fee = await FeeService.calculateFee("transfer", request.amount);
      const totalDebit = request.amount + fee;

      // Check sender has sufficient balance
      if (fromUser.balance < totalDebit) {
        throw new Error("Insufficient funds");
      }
   ```
4. create transaction record
   ```typescript
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
   ```
5. update balance
   ```typescript
      await User.findByIdAndUpdate(
        request.fromUserId,
        { $inc: { balance: -totalDebit } },
        { session }
      );

      await User.findByIdAndUpdate(
        request.toUserId,
        { $inc: { balance: request.amount } },
        { session }
      );

      await Company.findByIdAndUpdate(
        "company",
        { $inc: { balance: fee } },
        { session }
      );
   ```
6. Log everything
   ```typescript
   // logging the success transfer
      logger.info("Transfer processed successfully", {
        transactionId: transaction._id,
        fromUserId: request.fromUserId,
        toUserId: request.toUserId,
        amount: request.amount,
        fee,
        totalDebit,
      });

    // logging the error
    logger.error("Transfer failed", { error: error.message, request });
   ```
