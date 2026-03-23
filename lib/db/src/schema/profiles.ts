import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  avatarColor: text("avatar_color").notNull().default("#2ECC71"),
  petName: text("pet_name").notNull().default("Buddy"),
  petLevel: integer("pet_level").notNull().default(1),
  petMood: text("pet_mood").notNull().default("neutral"),
  streakDays: integer("streak_days").notNull().default(0),
  totalPoints: integer("total_points").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ createdAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
