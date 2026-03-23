import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { activityLogsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

router.post("/logs", async (req, res) => {
  const { profileId, type, value, notes, date } = req.body;
  if (!profileId || !type || value === undefined) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const today = date ?? new Date().toISOString().split("T")[0];

  const log = await db.insert(activityLogsTable).values({
    id: generateId(),
    profileId,
    type,
    value,
    notes,
    date: today,
  }).returning();

  res.status(201).json(log[0]);
});

router.get("/logs", async (req, res) => {
  const { profileId, date } = req.query;
  if (!profileId || typeof profileId !== "string") {
    res.status(400).json({ error: "profileId required" });
    return;
  }

  const logs = await db.select().from(activityLogsTable).where(eq(activityLogsTable.profileId, profileId));
  const filtered = date ? logs.filter((l) => l.date === date) : logs;
  res.json(filtered);
});

export default router;
