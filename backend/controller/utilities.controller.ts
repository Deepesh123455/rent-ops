import type { Request, Response } from "express";
import { UtilitiesService } from "../service/utilites.service.js";

export class UtilitiesController {
  constructor(
    private readonly utilitiesService: UtilitiesService = new UtilitiesService(),
  ) {}

  public payUtilities = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location_ids } = req.params;

      if (!location_ids) {
        res.status(400).json({
          success: false,
          message: "Please provide valid location IDs.",
        });
        return;
      }

      let idsArray: string[] = [];

      if (typeof location_ids === "string") {
        idsArray = location_ids
          .split(",")
          .map((id: string) => id.trim())
          .filter((id: string) => id.length > 0);
      } else if (Array.isArray(location_ids)) {
        idsArray = location_ids as string[];
      }

      if (idsArray.length === 0) {
        res.status(400).json({
          success: false,
          message: "Please provide valid comma-separated location IDs.",
        });
        return;
      }

      const result = await this.utilitiesService.payUtilities(idsArray);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
