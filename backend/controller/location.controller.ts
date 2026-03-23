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
      const idsParam = req.query.ids;

      if (!idsParam || typeof idsParam !== "string") {
        res.status(400).json({
          success: false,
          message:
            "Please provide location IDs in the URL query, e.g., ?ids=loc-1,loc-2",
        });
        return;
      }

      const idsArray = idsParam
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      if (idsArray.length === 0) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid array of location IDs.",
        });
        return;
      }

      const locations = await this.locationService.getLocationsByIds(idsArray);

      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  public getLocationsByStatus = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const statusParam = req.query.status;

      if (!statusParam || typeof statusParam !== "string") {
        res.status(400).json({
          success: false,
          message:
            "Please provide statuses in the URL query, e.g., ?status=pending,failed",
        });
        return;
      }

      const statusArray = statusParam
        .split(",")
        .map((status) => status.trim())
        .filter((status) => status.length > 0);

      if (statusArray.length === 0) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid array of statuses.",
        });
        return;
      }

      const locations =
        await this.locationService.getLocationsByStatus(statusArray);

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
      console.log("=> Inside GET /locations/summary");

      const idsParam = req.query.ids;
      let idsArray: string[] | undefined = undefined;

      if (idsParam) {
        if (typeof idsParam !== "string") {
          res.status(400).json({
            success: false,
            message:
              "Invalid format for ids. Expected a comma-separated string.",
          });
          return;
        }

        idsArray = idsParam
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0);

        if (idsArray.length === 0) {
          res.status(400).json({
            success: false,
            message: "Please provide valid location IDs.",
          });
          return;
        }
      }

      const summary = await this.locationService.getLocationSummary(idsArray);

      res.status(200).json({
        success: true,
        data: summary[0],
      });
    } catch (error: any) {
      console.error("Summary API Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
