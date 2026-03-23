import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const activityLogsTable = pgTable("activity_logs", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull(),
  type: text("type").notNull(),
  value: real("value").notNull(),
  notes: text("notes"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLogSchema = createInsertSchema(activityLogsTable).omit({ createdAt: true });
export type InsertLog = z.infer<typeof insertLogSchema>;
export type ActivityLog = typeof activityLogsTable.$inferSelect;
