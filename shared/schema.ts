import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with Google OAuth support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const meditationSessions = pgTable("meditation_sessions", {
  id: varchar("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // focus, stress, sleep
  level: text("level").notNull(), // beginner, intermediate, advanced
  duration: integer("duration").notNull(), // in minutes
  audioUrl: text("audio_url").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull(), // meditation, sleep_story, sleep_sound
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  sessionId: varchar("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  currentStreak: integer("current_streak").default(0),
  totalMinutes: integer("total_minutes").default(0),
  weeklyMinutes: integer("weekly_minutes").default(0),
  favoriteCategory: text("favorite_category"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // yoga, pilates, strength, cardio
  level: text("level").notNull(), // beginner, intermediate, advanced
  duration: integer("duration").notNull(), // in minutes
  videoUrl: text("video_url").notNull(),
  imageUrl: text("image_url").notNull(),
  instructions: text("instructions").array(),
  equipment: text("equipment").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyGoals = pgTable("daily_goals", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull(),
  meditationMinutes: integer("meditation_minutes").default(0),
  targetMeditationMinutes: integer("target_meditation_minutes").default(10),
  workoutMinutes: integer("workout_minutes").default(0),
  targetWorkoutMinutes: integer("target_workout_minutes").default(30),
  gratitudeEntries: integer("gratitude_entries").default(0),
  targetGratitudeEntries: integer("target_gratitude_entries").default(3),
  waterGlasses: integer("water_glasses").default(0),
  targetWaterGlasses: integer("target_water_glasses").default(8),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const audioFiles = pgTable("audio_files", {
  id: varchar("id").primaryKey().notNull(),
  sessionId: varchar("session_id").notNull(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  duration: integer("duration").notNull(), // in seconds
  fileSize: integer("file_size").notNull(), // in bytes
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  theme: text("theme").default("system"), // light, dark, system
  notifications: boolean("notifications").default(true),
  reminderTime: text("reminder_time").default("09:00"),
  language: text("language").default("en"),
  timezone: text("timezone").default("UTC"),
  autoPlay: boolean("auto_play").default(true),
  downloadQuality: text("download_quality").default("high"), // low, medium, high
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertSessionSchema = createInsertSchema(meditationSessions).omit({
  id: true,
  createdAt: true,
});
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
});
export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});
export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  updatedAt: true,
});
export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});
export const insertDailyGoalSchema = createInsertSchema(dailyGoals).omit({
  id: true,
  createdAt: true,
});
export const insertAudioFileSchema = createInsertSchema(audioFiles).omit({
  id: true,
  createdAt: true,
});
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Session = typeof meditationSessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type DailyGoal = typeof dailyGoals.$inferSelect;
export type InsertDailyGoal = z.infer<typeof insertDailyGoalSchema>;
export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertAudioFile = z.infer<typeof insertAudioFileSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
