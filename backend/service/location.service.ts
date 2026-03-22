import { LocationRepository } from "../repositry/location.repository.js";
import {
  type Location,
  type LocationSummary,
} from "../interfaces/location.interface.js";

export class LocationService {
  constructor(
    private readonly locationRepository: LocationRepository = new LocationRepository(),
  ) {}

  public async getAllLocations(): Promise<Location[]> {
    return await this.locationRepository.getAllLocations();
  }
  public async getLocationsByIds(ids: string[]): Promise<Location[]> {
    if (!ids || ids.length === 0) {
      throw new Error("Please Choose a location");
    }
    return await this.locationRepository.getLocationsByIds(ids);
  }
  public async getLocationSummary(ids?: string[]): Promise<LocationSummary[]> {
    // Redundant await hataya for cleaner execution
    return this.locationRepository.getLocationSummary(ids);
  }
}
