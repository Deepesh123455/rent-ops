import { Router } from "express";
import { PaymentController } from "../controller/payment.controller.js";
const router: Router = Router();
const paymentController = new PaymentController();

router.post("/pay/bulk",paymentController.payBulk);
router.post("/pay/:location_id",paymentController.paySingle);

export default router;
