import type { Request, Response } from "express";
import { PaymentService } from "../service/payment.service.js";

export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService = new PaymentService(),
  ) {}

  // POST /pay/:location_id
  public paySingle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location_id } = req.params;

      if (!location_id) {
        res
          .status(400)
          .json({ success: false, message: "Location id is required" });
        return;
      }
      // Idempotency Key validation from headers (Bonus Feature)
      const idempotencyKey = req.headers["x-idempotency-key"];
      if (!idempotencyKey) {
        res
          .status(400)
          .json({ success: false, message: "Idempotency key is required" });
        return;
      }

      const result =
        await this.paymentService.failedPaymentRetries(location_id as string);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result); // 400 for payment failure
      }
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // POST /pay/bulk
  public payBulk = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location_ids } = req.body;

      if (!Array.isArray(location_ids)) {
        res
          .status(400)
          .json({ success: false, message: "location_ids must be an array" });
        return;
      }

      const result =
        await this.paymentService.bulkPaymentSimulation(location_ids);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
