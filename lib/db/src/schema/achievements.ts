import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const achievementsTable = pgTable("achievements", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  points: integer("points").notNull().default(10),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievementsTable).omit({ earnedAt: true });
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievementsTable.$inferSelect;
