# Fee Logic
The mini wallet system's fee logic support for both percentage-based and fixed amount across different transactions types.

# Approach
1. Find the Fee from Mongo and check it existed or not
   ```typescript
    const feeConfig = await Fee.findOne({ service });
    // checking the fee config existed or not
    if (!feeConfig) {
      throw new Error(`Fee not found for service: ${service}`);
    }
   ```
2. Finding Right Tier using mapping
   ```typescript
    const tier = this.findApplicableTier(feeConfig.tiers, amount);
    if (!tier) {
      return 0;
    }
   ```
   Finding the right one using mapping (for loop)

    ```typescript
    private findApplicableTier(tiers: IFeeTier[], amount: number): IFeeTier | null {
      for (const tier of tiers) {
        // Check if amount falls within tier range
        if (amount >= tier.min && (tier.max === null || amount <= tier.max)) {
          return tier;
        }
      }
      return null;  // No applicable tier found
    }
    ```
3. return value according to the type (Percentage or Fixed)
   ``` typescript
    if (tier.type === 'percent') {
      return amount * tier.value;
    } else if (tier.type === 'fixed') {
      return tier.value;
    } else {
      throw new Error(`Unknown fee type: ${tier.type}`);
    }
   ```
