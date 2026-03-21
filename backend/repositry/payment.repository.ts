import { mockDatabase } from "../config/db.js";
import { type Location } from "../interfaces/location.interface.js";

export class PaymentRepository {
  private dbDelaySimulation(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async payByLocationId(
    location_id: string,
    newStatus: "paid" | "failed",
    transactionLog: any,
  ): Promise<Location | null> {
    await this.dbDelaySimulation(1000);

    const location = mockDatabase.find((loc) => loc.id === location_id);

    if (!location) return null;

    location.status = newStatus;
    location.history.push(transactionLog);

    return structuredClone(location);
  }
}
