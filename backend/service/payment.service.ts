import { LocationService } from "./location.service.js";
import { PaymentRepository } from "../repositry/payment.repository.js";
import { type Location } from "../interfaces/location.interface.js";
export class PaymentService {
  constructor(
    private readonly locationService: LocationService = new LocationService(),
    private readonly paymentRepository: PaymentRepository = new PaymentRepository(),
  ) {}
  private async executePaymentSimulation(
    id: string,
    amount: number,
  ): Promise<{ success: boolean; data?: Location; error?: string }> {
    const locations = await this.locationService.getLocationsByIds([id]);
    if (locations.length === 0)
      return { success: false, error: "Location not found" };

    const location = locations[0];

    // Idempotency / Double-charge protection
    if (location?.status === "paid") {
      return { success: false, error: "Already paid" };
    }
    if (location?.finalPayable !== amount) {
      return { success: false, error: "Amount mismatch" };
    }
    // 80% Success Rate Simulation
    const isSuccess = Math.random() > 0.2;
    const finalStatus = isSuccess ? "paid" : "failed";

    const transactionLog = {
      date: new Date().toISOString().split("T")[0],
      amount: location?.finalPayable,
      status: finalStatus,
      reference: `TXN-${Date.now()}-${id}`,
    };

    const updatedLocation = await this.paymentRepository.payByLocationId(
      id,
      finalStatus,
      transactionLog,
    );

    return isSuccess
      ? { success: true, data: updatedLocation! }
      : { success: false, error: "Bank network timeout" };
  }

  public async failedPaymentRetries(
    id: string,
    maxRetries: number = 3,
    amount: number,
  ) {
    let retries = 0;
    if (!id) {
      return {
        success: false,
        message: "Location id is required",
      };
    }

    while (retries < maxRetries) {
      retries++;
      console.log(`[Payment Attempt ${retries}/${maxRetries}] for ${id}`);
      const status = await this.executePaymentSimulation(id, amount);
      if (status.success || status.error === "paid") {
        return {
          ...status,
          message: `payment got successful at attempt ${retries}`,
        };
      }

      if (retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return {
      success: false,
      message: `payment failed after ${maxRetries} attempts Please try again later`,
    };
  }

  public async bulkPaymentSimulation(
    ids: string[],
    expectedTotalAmount: number,
  ) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Select multiple locations for the bulk payment");
    }

    const locations = await this.locationService.getLocationsByIds(ids);

    const actualTotalAmount = locations.reduce(
      (sum, loc) => sum + loc.finalPayable,
      0,
    );

    if (actualTotalAmount !== expectedTotalAmount) {
      throw new Error(
        `Amount mismatch detected. Expected total is ${expectedTotalAmount}, but calculated total is ${actualTotalAmount}. Transaction aborted for security.`,
      );
    }

    const locationAmountMap = new Map(
      locations.map((loc) => [loc.id, loc.finalPayable]),
    );

    const successfulIds: string[] = [];
    const failedIds: string[] = [];

    const paymentPromises = ids.map(async (id) => {
      const amount = locationAmountMap.get(id);

      if (amount === undefined) {
        failedIds.push(id);
        return;
      }

      const result = await this.failedPaymentRetries(id, 2, amount);

      if (result.success) {
        successfulIds.push(id);
      } else {
        failedIds.push(id);
      }
    });

    await Promise.all(paymentPromises);

    return {
      message: "Bulk payment simulation completed",
      total_processed: ids.length,
      success_count: successfulIds.length,
      failed_count: failedIds.length,
      successful_ids: successfulIds,
      failed_ids: failedIds,
    };
  }
}
