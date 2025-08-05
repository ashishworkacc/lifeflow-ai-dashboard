import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("User"),
  avatar: text("avatar"),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  priority: text("priority").notNull().default("medium"), // high, medium, low
  dueTime: text("due_time"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  streak: integer("streak").default(0),
  completedToday: boolean("completed_today").default(false),
  color: text("color").notNull(),
  type: text("type").default("boolean"), // boolean, counter
  targetValue: integer("target_value").default(1),
  currentValue: integer("current_value").default(0),
});

export const healthMetrics = pgTable("health_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // sleep, steps, water, weight
  value: integer("value").notNull(),
  unit: text("unit").notNull(),
  date: timestamp("date").defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  goalType: text("goal_type").notNull().default("percentage"), // "percentage" or "number"
  targetValue: integer("target_value").default(100), // for number-based goals
  currentValue: integer("current_value").default(0),
  unit: text("unit").default(""), // e.g., "books", "pages", "km", "calories", "₹"
  targetDate: timestamp("target_date"),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isArchived: boolean("is_archived").default(false),
});

export const goalEntries = pgTable("goal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalId: varchar("goal_id").notNull().references(() => goals.id, { onDelete: "cascade" }),
  value: integer("value").notNull(), // amount added/changed
  note: text("note"), // optional note for the entry
  date: timestamp("date").defaultNow(),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timeBlocks = pgTable("time_blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  startTime: text("start_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  color: text("color").notNull(),
  date: timestamp("date").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertHabitSchema = createInsertSchema(habits).omit({ id: true });
export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({ id: true, date: true });
export const insertGoalSchema = createInsertSchema(goals).omit({ id: true, createdAt: true });
export const insertGoalEntrySchema = createInsertSchema(goalEntries).omit({ id: true, date: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true });
export const insertTimeBlockSchema = createInsertSchema(timeBlocks).omit({ id: true, date: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoalEntry = z.infer<typeof insertGoalEntrySchema>;
export type GoalEntry = typeof goalEntries.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertTimeBlock = z.infer<typeof insertTimeBlockSchema>;
export type TimeBlock = typeof timeBlocks.$inferSelect;
