# Cash In Logic
The cash logic make to transfer from company to one user by validating all the related information.

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
2. check User is valid and get the company
   ```typescript
      // Validate user exists
      const user = await User.findById(request.userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }
      // Get company
      const company = await Company.findById("company").session(session);
      if (!company) {
        throw new Error("Company not found");
      }
   ```
3. calculate fee
   ```typescript
      // Calculate fee
      const fee = await FeeService.calculateFee("cashin", request.amount);
      const netAmount = request.amount - fee;
   ```
4. check company balance and create transaction record
   ```typescript
      // Check company has sufficient balance
      if (company.balance < request.amount) {
        throw new Error("Insufficient company balance");
      }

      // Create transaction record
      const transaction = new Transaction({
        type: "cashin",
        fromAccountType: "company",
        fromCompanyId: "company",
        toAccountType: "user",
        toUserId: request.userId,
        amount: request.amount,
        fee,
        feeType: "credit",
        companyDelta: -request.amount + fee,
        status: "SUCCESS",
        idempotencyKey,
      });
   ```
5. update balance
   ```typescript
      // Update balances
      await User.findByIdAndUpdate(
        request.userId,
        { $inc: { balance: netAmount } },
        { session }
      );

      await Company.findByIdAndUpdate(
        "company",
        { $inc: { balance: -request.amount + fee } },
        { session }
      );
   ```
6. Log everything
   ```typescript
   // logging the success transfer
      logger.info("Cash In processed successfully", {
        transactionId: transaction._id,
        fromUserId: request.fromUserId,
        toUserId: request.toUserId,
        amount: request.amount,
        fee,
        totalDebit,
      });

    // logging the error
    logger.error("Cash in failed", { error: error.message, request });
   ```
