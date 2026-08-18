import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error-handler.js";

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
