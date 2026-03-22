import { Router } from "express";
import { PaymentController } from "../controller/payment.controller.js";
const PaymentRouter: Router = Router();
const paymentController = new PaymentController();

PaymentRouter.post("/pay/bulk",paymentController.payBulk);
PaymentRouter.post("/pay/:location_id",paymentController.paySingle);

export default PaymentRouter;
