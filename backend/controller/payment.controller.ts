import type { Request, Response } from "express";
import { PaymentService } from "../service/payment.service.js";

export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService = new PaymentService(),
  ) {}

  public paySingle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location_id, amount } = req.body;

      if (!location_id) {
        res
          .status(400)
          .json({ success: false, message: "Location id is required" });
        return;
      }

      const idempotencyKey = req.headers["x-idempotency-key"];
      if (!idempotencyKey) {
        res
          .status(400)
          .json({ success: false, message: "Idempotency key is required" });
        return;
      }

      const result = await this.paymentService.failedPaymentRetries(
        location_id as string,
        3,
        amount as number,
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  public payBulk = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location_ids, total_amount } = req.body;

      if (!Array.isArray(location_ids) || location_ids.length === 0) {
        res
          .status(400)
          .json({
            success: false,
            message: "location_ids must be a non-empty array",
          });
        return;
      }

      if (typeof total_amount !== "number") {
        res
          .status(400)
          .json({
            success: false,
            message:
              "Valid total_amount is required for bulk processing security",
          });
        return;
      }

      const idempotencyKey = req.headers["x-idempotency-key"];
      if (!idempotencyKey) {
        res
          .status(400)
          .json({
            success: false,
            message: "Idempotency key is required for bulk payments",
          });
        return;
      }

      const result = await this.paymentService.bulkPaymentSimulation(
        location_ids,
        total_amount,
      );
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
