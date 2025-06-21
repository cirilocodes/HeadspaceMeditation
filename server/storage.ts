import { 
  users, sessions, userProgress, userFavorites, userStats,
  type User, type InsertUser, type Session, type InsertSession,
  type UserProgress, type InsertUserProgress, type UserFavorite, 
  type InsertUserFavorite, type UserStats, type InsertUserStats
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session methods
  getAllSessions(): Promise<Session[]>;
  getSessionsByCategory(category: string): Promise<Session[]>;
  getSessionsByType(type: string): Promise<Session[]>;
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  
  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getSessionProgress(userId: number, sessionId: number): Promise<UserProgress | undefined>;
  createProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;
  
  // Favorites methods
  getUserFavorites(userId: number): Promise<UserFavorite[]>;
  addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavorite(userId: number, sessionId: number): Promise<boolean>;
  
  // Stats methods
  getUserStats(userId: number): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<number, Session>;
  private userProgress: Map<number, UserProgress>;
  private userFavorites: Map<number, UserFavorite>;
  private userStats: Map<number, UserStats>;
  private currentUserId: number;
  private currentSessionId: number;
  private currentProgressId: number;
  private currentFavoriteId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.userProgress = new Map();
    this.userFavorites = new Map();
    this.userStats = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
    this.currentProgressId = 1;
    this.currentFavoriteId = 1;
    this.currentStatsId = 1;
    
    this.seedData();
  }

  private seedData() {
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

    sampleSessions.forEach(session => {
      this.createSession(session);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Create initial user stats
    await this.createUserStats({
      userId: id,
      currentStreak: 0,
      totalMinutes: 0,
      weeklyMinutes: 0,
      favoriteCategory: null
    });
    
    return user;
  }

  // Session methods
  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values());
  }

  async getSessionsByCategory(category: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(session => session.category === category);
  }

  async getSessionsByType(type: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(session => session.type === type);
  }

  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = { ...insertSession, id };
    this.sessions.set(id, session);
    return session;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getSessionProgress(userId: number, sessionId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      progress => progress.userId === userId && progress.sessionId === sessionId
    );
  }

  async createProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const progress: UserProgress = { ...insertProgress, id };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updated = { ...progress, ...updates };
    this.userProgress.set(id, updated);
    return updated;
  }

  // Favorites methods
  async getUserFavorites(userId: number): Promise<UserFavorite[]> {
    return Array.from(this.userFavorites.values()).filter(favorite => favorite.userId === userId);
  }

  async addFavorite(insertFavorite: InsertUserFavorite): Promise<UserFavorite> {
    const id = this.currentFavoriteId++;
    const favorite: UserFavorite = { ...insertFavorite, id };
    this.userFavorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: number, sessionId: number): Promise<boolean> {
    const favorite = Array.from(this.userFavorites.entries()).find(
      ([_, fav]) => fav.userId === userId && fav.sessionId === sessionId
    );
    
    if (favorite) {
      this.userFavorites.delete(favorite[0]);
      return true;
    }
    return false;
  }

  // Stats methods
  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return Array.from(this.userStats.values()).find(stats => stats.userId === userId);
  }

  async createUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const id = this.currentStatsId++;
    const stats: UserStats = { ...insertStats, id };
    this.userStats.set(id, stats);
    return stats;
  }

  async updateUserStats(userId: number, updates: Partial<UserStats>): Promise<UserStats | undefined> {
    const stats = Array.from(this.userStats.entries()).find(([_, s]) => s.userId === userId);
    if (!stats) return undefined;
    
    const updated = { ...stats[1], ...updates };
    this.userStats.set(stats[0], updated);
    return updated;
  }
}

export const storage = new MemStorage();
