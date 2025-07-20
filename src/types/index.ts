export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
  type: string;
  createdAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  sessionId: string;
  completed: boolean;
  completedAt: string | null;
  timeSpent: number;
  createdAt: string;
}

export interface UserStats {
  id: string;
  userId: string;
  currentStreak: number;
  totalMinutes: number;
  weeklyMinutes: number;
  favoriteCategory: string | null;
  updatedAt: string;
}

export interface DailyGoal {
  id: string;
  userId: string;
  date: string;
  meditationMinutes: number;
  targetMeditationMinutes: number;
  workoutMinutes: number;
  targetWorkoutMinutes: number;
  gratitudeEntries: number;
  targetGratitudeEntries: number;
  waterGlasses: number;
  targetWaterGlasses: number;
  completed: boolean;
  createdAt: string;
}