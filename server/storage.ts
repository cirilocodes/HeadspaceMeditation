import { 
  users, meditationSessions, userProgress, userFavorites, userStats,
  type User, type UpsertUser, type Session, type InsertSession,
  type UserProgress, type InsertUserProgress, type UserFavorite, 
  type InsertUserFavorite, type UserStats, type InsertUserStats
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
          audioUrl: "/audio/morning-mindfulness.mp3",
          imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Deep Focus",
          description: "Enhance concentration and mental clarity",
          category: "focus",
          level: "intermediate",
          duration: 20,
          audioUrl: "/audio/deep-focus.mp3",
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Stress Release",
          description: "Let go of tension and find inner calm",
          category: "stress",
          level: "advanced",
          duration: 15,
          audioUrl: "/audio/stress-release.mp3",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Bedtime Preparation",
          description: "Prepare your mind for restful sleep",
          category: "sleep",
          level: "beginner",
          duration: 25,
          audioUrl: "/audio/bedtime-preparation.mp3",
          imageUrl: "https://images.unsplash.com/photo-1520637836862-4d197d17c52a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "meditation"
        },
        {
          title: "Enchanted Forest",
          description: "A magical journey through ancient woods",
          category: "sleep",
          level: "beginner",
          duration: 25,
          audioUrl: "/audio/enchanted-forest.mp3",
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "sleep_story"
        },
        {
          title: "Ocean Waves",
          description: "Gentle waves lapping the shore",
          category: "sleep",
          level: "beginner",
          duration: 0, // Continuous
          audioUrl: "/audio/ocean-waves.mp3",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "sleep_sound"
        },
        {
          title: "Forest Rain",
          description: "Soft rainfall in the wilderness",
          category: "sleep",
          level: "beginner",
          duration: 0, // Continuous
          audioUrl: "/audio/forest-rain.mp3",
          imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
          type: "sleep_sound"
        }
      ];

      for (const session of sampleSessions) {
        await this.createSession(session);
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
}

export const storage = new DatabaseStorage();
