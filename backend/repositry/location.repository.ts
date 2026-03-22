import { mockDatabase } from "../config/db.js";
import {
  type Location,
  type LocationSummary,
} from "../interfaces/location.interface.js";

export class LocationRepository {
  private async simulateDBDelay(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async getAllLocations(): Promise<Location[]> {
    await this.simulateDBDelay();
    return structuredClone(mockDatabase);
  }

  public async getLocationsByIds(ids: string[]): Promise<Location[]> {
    await this.simulateDBDelay();

    const idSet = new Set(ids);
    const locationById = mockDatabase.filter((loc) => idSet.has(loc.id));

    return structuredClone(locationById);
  }

  public async getLocationSummary(ids?: string[]): Promise<LocationSummary[]> {
    await this.simulateDBDelay(); // Tera original delay function

    let dataToProcess = mockDatabase;

   
    if (ids && ids.length > 0) {
      const idSet = new Set(ids);
      dataToProcess = mockDatabase.filter((loc) => idSet.has(loc.id));
    }

    const summary = dataToProcess.reduce(
      (acc, curr) => {
        acc.total_rent_payable += curr.rent;
        acc.total_gst_payable += curr.gst;
        acc.total_tds_payable += curr.tds;
        acc.total_adjustments += curr.adjustments;
        acc.total_final_payable += curr.finalPayable;
        acc.total_locations += 1;

        return acc;
      },
      {
        total_rent_payable: 0,
        total_gst_payable: 0,
        total_tds_payable: 0,
        total_adjustments: 0,
        total_final_payable: 0,
        total_locations: 0,
      },
    );

    console.log("Calculated Summary:", summary);
    return [summary];
  }
}
