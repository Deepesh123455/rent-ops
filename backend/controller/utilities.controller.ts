import type { Request, Response } from "express";
import { UtilitiesService } from "../service/utilites.service.js";
export class UtilitiesController {
  constructor(
    private readonly utilitiesService: UtilitiesService = new UtilitiesService(),
  ) {}

  public payUtilities = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location_ids, total_amount } = req.body;

      if (!Array.isArray(location_ids) || location_ids.length === 0) {
        res.status(400).json({
          success: false,
          message: "location_ids must be a non-empty array.",
        });
        return;
      }

      if (typeof total_amount !== "number") {
        res.status(400).json({
          success: false,
          message: "Valid total_amount is required for security verification.",
        });
        return;
      }

      const result = await this.utilitiesService.payUtilities(
        location_ids,
        total_amount,
      );

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
