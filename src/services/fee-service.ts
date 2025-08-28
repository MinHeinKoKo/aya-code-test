import Fee from "../models/fee";
import { IFeeTier } from "../types/fee";
class FeeService {
  async calculateFee(service: string, amount: number): Promise<number> {
    const feeConfig = await Fee.findOne({ service });

    if (!feeConfig) {
      throw new Error(`No fee configuration found for service: ${service}`);
    }

    const tier = this.findApplicableTier(feeConfig.tiers, amount);
    if (!tier) {
      return 0;
    }

    if (tier.type === "percent") {
      return amount * tier.value;
    } else if (tier.type === "fixed") {
      return tier.value;
    } else {
      throw new Error(`Unknown fee type: ${tier.type}`);
    }
  }

  private findApplicableTier(
    tiers: IFeeTier[],
    amount: number,
  ): IFeeTier | null {
    for (const tier of tiers) {
      if (amount >= tier.min && (tier.max === null || amount <= tier.max)) {
        return tier;
      }
    }
    return null;
  }
}

export default new FeeService();
