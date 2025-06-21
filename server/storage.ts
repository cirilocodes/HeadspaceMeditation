import { 
  users, meditationSessions, userProgress, userFavorites, userStats,
  workouts, dailyGoals, audioFiles, userSettings,
  type User, type UpsertUser, type Session, type InsertSession,
  type UserProgress, type InsertUserProgress, type UserFavorite, 
  type InsertUserFavorite, type UserStats, type InsertUserStats,
  type Workout, type InsertWorkout, type DailyGoal, type InsertDailyGoal,
  type AudioFile, type InsertAudioFile, type UserSettings, type InsertUserSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export interface IStorage {
  // User methods (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Session methods
  getAllSessions(): Promise<Session[]>;
  getSessionsByCategory(category: string): Promise<Session[]>;
  getSessionsByType(type: string): Promise<Session[]>;
  getSession(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  
  // Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getSessionProgress(userId: string, sessionId: string): Promise<UserProgress | undefined>;
  createProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
  
  // Favorites methods
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavorite(userId: string, sessionId: string): Promise<boolean>;
  
  // Stats methods
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats | undefined>;
  
  // Workout methods
  getAllWorkouts(): Promise<Workout[]>;
  getWorkoutsByCategory(category: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  
  // Daily goals methods
  getDailyGoal(userId: string, date: Date): Promise<DailyGoal | undefined>;
  createDailyGoal(goal: InsertDailyGoal): Promise<DailyGoal>;
  updateDailyGoal(userId: string, date: Date, updates: Partial<DailyGoal>): Promise<DailyGoal | undefined>;
  
  // Audio files methods
  getAudioFile(sessionId: string): Promise<AudioFile | undefined>;
  createAudioFile(audioFile: InsertAudioFile): Promise<AudioFile>;
  
  // User settings methods
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    try {
      // Check if sessions already exist
      const existingSessions = await db.select().from(meditationSessions).limit(1);
      if (existingSessions.length > 0) return;

      // Create sample sessions
      const sampleSessions: InsertSession[] = [
        {
          title: "Morning Mindfulness",
          description: "Start your day with clarity and intention",
          category: "focus",
          level: "beginner",
          duration: 10,
          audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
          imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Deep Focus",
          description: "Enhance concentration and mental clarity",
          category: "focus",
          level: "intermediate",
          duration: 20,
          audioUrl: "https://www.soundjay.com/misc/sounds/rain-01.mp3",
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Stress Release",
          description: "Let go of tension and find inner calm",
          category: "stress",
          level: "advanced",
          duration: 15,
          audioUrl: "https://www.soundjay.com/misc/sounds/wind-01.mp3",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Bedtime Preparation",
          description: "Prepare your mind for restful sleep",
          category: "sleep",
          level: "beginner",
          duration: 25,
          audioUrl: "https://www.soundjay.com/misc/sounds/water-01.mp3",
          imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c52a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Enchanted Forest",
          description: "A magical journey through ancient woods",
          category: "sleep",
          level: "beginner",
          duration: 25,
          audioUrl: "https://www.soundjay.com/misc/sounds/forest-01.mp3",
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "sleep_story"
        },
        {
          title: "Ocean Waves",
          description: "Gentle waves lapping the shore",
          category: "sleep",
          level: "beginner",
          duration: 0, // Continuous
          audioUrl: "https://www.soundjay.com/misc/sounds/ocean-01.mp3",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "sleep_sound"
        },
        {
          title: "Forest Rain",
          description: "Soft rainfall in the wilderness",
          category: "sleep",
          level: "beginner",
          duration: 0, // Continuous
          audioUrl: "https://www.soundjay.com/misc/sounds/rain-02.mp3",
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "sleep_sound"
        }
      ];

      for (const session of sampleSessions) {
        await this.createSession(session);
      }

      // Create sample workouts
      const sampleWorkouts: InsertWorkout[] = [
        {
          title: "Morning Yoga Flow",
          description: "Gentle yoga sequence to start your day",
          category: "yoga",
          level: "beginner",
          duration: 20,
          videoUrl: "https://www.youtube.com/embed/VaoV1PrYft4",
          imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          instructions: ["Start in mountain pose", "Flow through sun salutations", "Hold warrior poses", "End in savasana"],
          equipment: ["Yoga mat"]
        },
        {
          title: "Core Strength",
          description: "Build core strength with targeted exercises",
          category: "strength",
          level: "intermediate",
          duration: 15,
          videoUrl: "https://www.youtube.com/embed/3p8EBPVZ2Iw",
          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          instructions: ["Warm up with gentle movements", "Perform planks and crunches", "Include side planks", "Cool down with stretches"],
          equipment: ["Exercise mat"]
        },
        {
          title: "Evening Stretch",
          description: "Relaxing stretches to unwind",
          category: "yoga",
          level: "beginner",
          duration: 10,
          videoUrl: "https://www.youtube.com/embed/coG7dHSowbE",
          imageUrl: "https://images.unsplash.com/photo-1506629905607-f5b8a816cea5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          instructions: ["Focus on breathing", "Gentle spinal twists", "Hip openers", "Forward folds"],
          equipment: ["Yoga mat", "Pillows"]
        }
      ];

      const existingWorkouts = await db.select().from(workouts).limit(1);
      if (existingWorkouts.length === 0) {
        for (const workout of sampleWorkouts) {
          await this.createWorkout(workout);
        }
      }
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  }

  // User methods (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();

    // Create initial user stats if user is new
    const existingStats = await this.getUserStats(user.id);
    if (!existingStats) {
      await this.createUserStats({
        userId: user.id,
        currentStreak: 0,
        totalMinutes: 0,
        weeklyMinutes: 0,
        favoriteCategory: null
      });
    }

    // Create initial user settings if user is new
    const existingSettings = await this.getUserSettings(user.id);
    if (!existingSettings) {
      await this.createUserSettings({
        userId: user.id,
        theme: "system",
        notifications: true,
        reminderTime: "09:00",
        language: "en",
        timezone: "UTC",
        autoPlay: true,
        downloadQuality: "high"
      });
    }

    return user;
  }

  // Session methods
  async getAllSessions(): Promise<Session[]> {
    return await db.select().from(meditationSessions);
  }

  async getSessionsByCategory(category: string): Promise<Session[]> {
    return await db.select().from(meditationSessions).where(eq(meditationSessions.category, category));
  }

  async getSessionsByType(type: string): Promise<Session[]> {
    return await db.select().from(meditationSessions).where(eq(meditationSessions.type, type));
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(meditationSessions).where(eq(meditationSessions.id, id));
    return session;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = uuidv4();
    const [session] = await db
      .insert(meditationSessions)
      .values({ ...insertSession, id })
      .returning();
    return session;
  }

  // Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getSessionProgress(userId: string, sessionId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.sessionId, sessionId)));
    return progress;
  }

  async createProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = uuidv4();
    const [progress] = await db
      .insert(userProgress)
      .values({ 
        ...insertProgress, 
        id,
        completed: insertProgress.completed ?? false,
        completedAt: insertProgress.completedAt ?? null,
        timeSpent: insertProgress.timeSpent ?? 0
      })
      .returning();
    return progress;
  }

  async updateProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [progress] = await db
      .update(userProgress)
      .set(updates)
      .where(eq(userProgress.id, id))
      .returning();
    return progress;
  }

  // Favorites methods
  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return await db.select().from(userFavorites).where(eq(userFavorites.userId, userId));
  }

  async addFavorite(insertFavorite: InsertUserFavorite): Promise<UserFavorite> {
    const id = uuidv4();
    const [favorite] = await db
      .insert(userFavorites)
      .values({ ...insertFavorite, id })
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, sessionId: string): Promise<boolean> {
    const result = await db
      .delete(userFavorites)
      .where(and(eq(userFavorites.userId, userId), eq(userFavorites.sessionId, sessionId)));
    return (result.rowCount || 0) > 0;
  }

  // Stats methods
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async createUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const id = uuidv4();
    const [stats] = await db
      .insert(userStats)
      .values({ 
        ...insertStats, 
        id,
        currentStreak: insertStats.currentStreak ?? 0,
        totalMinutes: insertStats.totalMinutes ?? 0,
        weeklyMinutes: insertStats.weeklyMinutes ?? 0,
        favoriteCategory: insertStats.favoriteCategory ?? null
      })
      .returning();
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats | undefined> {
    const [stats] = await db
      .update(userStats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return stats;
  }

  // Workout methods
  async getAllWorkouts(): Promise<Workout[]> {
    return await db.select().from(workouts);
  }

  async getWorkoutsByCategory(category: string): Promise<Workout[]> {
    return await db.select().from(workouts).where(eq(workouts.category, category));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout;
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = uuidv4();
    const [workout] = await db
      .insert(workouts)
      .values({ ...insertWorkout, id })
      .returning();
    return workout;
  }

  // Daily goals methods
  async getDailyGoal(userId: string, date: Date): Promise<DailyGoal | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [goal] = await db.select().from(dailyGoals)
      .where(and(
        eq(dailyGoals.userId, userId),
        and(
          eq(dailyGoals.date, startOfDay),
          eq(dailyGoals.date, endOfDay)
        )
      ));
    return goal;
  }

  async createDailyGoal(insertGoal: InsertDailyGoal): Promise<DailyGoal> {
    const id = uuidv4();
    const [goal] = await db
      .insert(dailyGoals)
      .values({ ...insertGoal, id })
      .returning();
    return goal;
  }

  async updateDailyGoal(userId: string, date: Date, updates: Partial<DailyGoal>): Promise<DailyGoal | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const [goal] = await db
      .update(dailyGoals)
      .set(updates)
      .where(and(eq(dailyGoals.userId, userId), eq(dailyGoals.date, startOfDay)))
      .returning();
    return goal;
  }

  // Audio files methods
  async getAudioFile(sessionId: string): Promise<AudioFile | undefined> {
    const [audioFile] = await db.select().from(audioFiles).where(eq(audioFiles.sessionId, sessionId));
    return audioFile;
  }

  async createAudioFile(insertAudioFile: InsertAudioFile): Promise<AudioFile> {
    const id = uuidv4();
    const [audioFile] = await db
      .insert(audioFiles)
      .values({ ...insertAudioFile, id })
      .returning();
    return audioFile;
  }

  // User settings methods
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = uuidv4();
    const [settings] = await db
      .insert(userSettings)
      .values({ ...insertSettings, id })
      .returning();
    return settings;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const [settings] = await db
      .update(userSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSettings.userId, userId))
      .returning();
    return settings;
  }
}

export const storage = new DatabaseStorage();
