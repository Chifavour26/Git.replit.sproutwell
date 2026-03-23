import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable, activityLogsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

router.get("/profiles", async (_req, res) => {
  const profiles = await db.select().from(profilesTable);
  res.json(profiles);
});

router.post("/profiles", async (req, res) => {
  const { name, age, avatarColor, petName } = req.body;
  if (!name || typeof age !== "number") {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const profile = await db.insert(profilesTable).values({
    id: generateId(),
    name,
    age,
    avatarColor: avatarColor ?? "#2ECC71",
    petName: petName ?? "Buddy",
    petLevel: 1,
    petMood: "neutral",
    streakDays: 0,
    totalPoints: 0,
  }).returning();

  res.status(201).json(profile[0]);
});

router.get("/profiles/:id", async (req, res) => {
  const profile = await db.select().from(profilesTable).where(eq(profilesTable.id, req.params.id));
  if (!profile[0]) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(profile[0]);
});

router.get("/profiles/:id/dashboard", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const logs = await db
    .select()
    .from(activityLogsTable)
    .where(
      and(
        eq(activityLogsTable.profileId, req.params.id),
        eq(activityLogsTable.date, today)
      )
    );

  const agg = { fruitsVeggies: 0, activityMinutes: 0, sleepHours: 0, screenTimeHours: 0, waterGlasses: 0 };
  for (const log of logs) {
    if (log.type === "nutrition") agg.fruitsVeggies += log.value;
    if (log.type === "activity") agg.activityMinutes += log.value;
    if (log.type === "sleep") agg.sleepHours += log.value;
    if (log.type === "screen_time") agg.screenTimeHours += log.value;
    if (log.type === "water") agg.waterGlasses += log.value;
  }

  const goals = { fruitsVeggies: 5, activityMinutes: 60, sleepHours: 10, screenTimeHours: 2, waterGlasses: 8 };
  let score = 0;
  if (agg.fruitsVeggies >= goals.fruitsVeggies) score += 20;
  if (agg.activityMinutes >= goals.activityMinutes) score += 20;
  if (agg.sleepHours >= goals.sleepHours) score += 20;
  if (agg.screenTimeHours <= goals.screenTimeHours) score += 20;
  if (agg.waterGlasses >= goals.waterGlasses) score += 20;

  res.json({ profileId: req.params.id, date: today, ...agg, goals, score });
});

export default router;
