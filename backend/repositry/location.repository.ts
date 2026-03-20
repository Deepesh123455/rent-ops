import { mockLocations } from "../config/db.js";
import { type Location } from "../interfaces/location.interface.js";

export class LocationRepository {
  public async getAllLocations(): Promise<Location[]> {
    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [...mockLocations];
  }

  public async getLocationsByIds(ids: string[]): Promise<Location[]> {
    // Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return mockLocations.filter((loc) => ids.includes(loc.id));
  }
}
