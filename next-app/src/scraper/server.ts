import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.SCRAPER_PORT ? parseInt(process.env.SCRAPER_PORT) : 3001;

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

/** POST /api/crawl — implemented in TASK-13 */
app.post("/api/crawl", (req: Request, res: Response) => {
  res.status(501).json({ success: false, error: "Not implemented yet" });
});

/** Global error handler */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`Scraping API running on port ${PORT}`);
});

export default app;
