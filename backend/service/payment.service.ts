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
  ): Promise<{ success: boolean; data?: Location; error?: string }> {
    const locations = await this.locationService.getLocationsByIds([id]);
    if (locations.length === 0)
      return { success: false, error: "Location not found" };

    const location = locations[0];

    if (location?.status === "paid") {
      return { success: false, error: "Already paid" };
    }

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

  public async failedPaymentRetries(id: string, maxRetries: number = 3) {
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
      const status = await this.executePaymentSimulation(id);
      if (status.success) {
        return {
          ...status,
          message: `payment got successful at attempt ${retries}`,
        };
      }
      if (
        status.error === "Already paid" ||
        status.error === "Location not found"
      ) {
        console.log(
          `[Payment Aborted] ${id} is ${status.error}. No retries needed.`,
        );
        return {
          success: false,
          error: status.error,
          message: `Payment skipped: ${status.error}`,
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

  public async bulkPaymentSimulation() {
    const locations = await this.locationService.getLocationsByStatus([
      "Pending",
      "Failed",
    ]);

    if (!locations || locations.length === 0) {
      throw new Error("No pending or failed payments found to process.");
    }

    const successfulIds: string[] = [];
    const failedIds: string[] = [];
    let totalAmountProcessed = 0;

    const paymentPromises = locations.map(async (loc) => {
      try {
        const result = await this.failedPaymentRetries(loc.id, 2);

        if (result.success) {
          successfulIds.push(loc.id);
          totalAmountProcessed += loc.finalPayable;
        } else {
          failedIds.push(loc.id);
        }
      } catch (error) {
        failedIds.push(loc.id);
      }
    });

    await Promise.all(paymentPromises);

    return {
      message: "Bulk payment simulation completed",
      total_locations_found: locations.length,
      success_count: successfulIds.length,
      failed_count: failedIds.length,
      total_amount_processed: totalAmountProcessed,
      successful_ids: successfulIds,
      failed_ids: failedIds,
    };
  }
}
