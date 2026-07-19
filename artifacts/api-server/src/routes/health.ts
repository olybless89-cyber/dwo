import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// DB connectivity diagnostic — remove after confirming Render works
router.get("/healthz/db", async (_req, res): Promise<void> => {
  try {
    const result = await pool.query("SELECT 1 AS ok");
    res.json({ db: "ok", row: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ db: "error", message: err.message, code: err.code });
  }
});

export default router;
