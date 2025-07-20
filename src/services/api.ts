const API_BASE_URL = 'http://localhost:5000/api';

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
}

export interface UserProgress {
  id: string;
  userId: string;
  sessionId: string;
  completed: boolean;
  completedAt: string | null;
  timeSpent: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/user');
  }

  async getAllSessions(): Promise<MeditationSession[]> {
    return this.request<MeditationSession[]>('/sessions');
  }

  async getSessionsByCategory(category: string): Promise<MeditationSession[]> {
    return this.request<MeditationSession[]>(`/sessions?category=${category}`);
  }

  async getSession(id: string): Promise<MeditationSession> {
    return this.request<MeditationSession>(`/sessions/${id}`);
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return this.request<UserProgress[]>(`/progress/${userId}`);
  }

  async createProgress(data: {
    userId: string;
    sessionId: string;
    completed?: boolean;
    timeSpent?: number;
  }): Promise<UserProgress> {
    return this.request<UserProgress>('/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();