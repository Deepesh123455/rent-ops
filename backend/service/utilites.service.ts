import { LocationService } from "./location.service.js";

export class UtilitiesService {
  constructor(
    private readonly locationService: LocationService = new LocationService(),
  ) {}

  public async payUtilities(
    ids: string[],
    expectedTotalAmount: number,
  ): Promise<{
    success: boolean;
    totalAmount: number;
    processedCount: number;
    message: string;
  }> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error(
        "Please provide a valid array of location IDs for utility payment.",
      );
    }

    const locations = await this.locationService.getLocationsByIds(ids);

    if (locations.length === 0) {
      throw new Error("No valid locations found for the provided IDs.");
    }
    const actualTotalAmount = locations.reduce(
      (acc, curr) => acc + curr.finalPayable,
      0,
    );

    if (actualTotalAmount !== expectedTotalAmount) {
      throw new Error(
        `Amount mismatch detected. Expected ₹${expectedTotalAmount}, but calculated ₹${actualTotalAmount}. Transaction aborted.`,
      );
    }

    return {
      success: true,
      message: "Utilities calculated and processed successfully.",
      totalAmount: actualTotalAmount,
      processedCount: locations.length,
    };
  }
}
