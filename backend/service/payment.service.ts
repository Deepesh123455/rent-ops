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

    // Idempotency / Double-charge protection
    if (location?.status === "paid") {
      return { success: false, error: "Already paid" };
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

  public async failedPaymentRetries(id: string, maxRetries: number = 3) {
    let retries = 0;
    if(!id){
      return {
        success: false,
        message: "Location id is required",
      };
    }
    while (retries < maxRetries) {
      retries++;
      console.log(`[Payment Attempt ${retries}/${maxRetries}] for ${id}`);
      const status = await this.executePaymentSimulation(id);
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

  public async bulkPaymentSimulation(ids: string[]) {

  }
}
