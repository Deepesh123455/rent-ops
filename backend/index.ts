import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
