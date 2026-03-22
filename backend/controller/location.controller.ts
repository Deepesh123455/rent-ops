import type { Request, Response } from "express";
import { LocationService } from "../service/location.service.js";

export class LocationController {
  constructor(
    private readonly locationService: LocationService = new LocationService(),
  ) {}

  public getAllLocations = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const locations = await this.locationService.getAllLocations();

      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public getLocationsByIds = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { ids } = req.body;

      // Type checking and validation
      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message:
            "Please provide a valid array of location IDs in the 'ids' field.",
        });
        return;
      }

      const locations = await this.locationService.getLocationsByIds(ids);

      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  public getLocationSummary = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids)) {
        res.status(400).json({
          success: false,
          message: "Please provide an array of location IDs.",
        });
        return;
      }

      const summary = await this.locationService.getLocationSummary(ids);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
