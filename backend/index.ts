import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import dotenv from "dotenv";
import LocationRouter from "./router/location.router.js";
import PaymentRouter from "./router/payment.router.js";
import UtilitiesRouter from "./router/utilities.router.js";
dotenv.config();
const app: Application = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1", LocationRouter);
app.use("/api/v1/payments", PaymentRouter);
app.use("/api/v1/utilities", UtilitiesRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
