import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { achievementsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

router.get("/achievements/:profileId", async (req, res) => {
  const achievements = await db
    .select()
    .from(achievementsTable)
    .where(eq(achievementsTable.profileId, req.params.profileId));
  res.json(achievements);
});

router.post("/achievements", async (req, res) => {
  const { profileId, type, title, description, icon, points } = req.body;
  if (!profileId || !type || !title) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const achievement = await db.insert(achievementsTable).values({
    id: generateId(),
    profileId,
    type,
    title,
    description: description ?? "",
    icon: icon ?? "star",
    points: points ?? 10,
  }).returning();

  res.status(201).json(achievement[0]);
});

export default router;
