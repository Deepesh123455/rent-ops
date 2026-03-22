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
      console.log("=> Inside GET /locations/summary");

      const idsParam = req.query.ids;
      let idsArray: string[] | undefined = undefined;

      // MANDATE CHECK 1: Agar URL mein ids hain, toh properly parse karo
      if (idsParam) {
        if (typeof idsParam !== "string") {
          res.status(400).json({
            success: false,
            message:
              "Invalid format for ids. Expected a comma-separated string.",
          });
          return;
        }

        // String ko split karo, aage-peeche ke spaces hatao, aur empty strings hatao
        idsArray = idsParam
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0);

        // MANDATE CHECK 2: Agar comma toh lagaya par IDs nahi di (?ids=,,)
        if (idsArray.length === 0) {
          res.status(400).json({
            success: false,
            message: "Please provide valid location IDs.",
          });
          return;
        }
      }

      // Agar idsArray undefined hai, toh Repository automatically sabka total nikal degi
      const summary = await this.locationService.getLocationSummary(idsArray);

      res.status(200).json({
        success: true,
        data: summary[0], // Array ke andar se object nikal kar clean format mein bheja
      });
    } catch (error: any) {
      console.error("Summary API Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
