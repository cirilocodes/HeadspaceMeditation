import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSessionSchema, insertUserProgressSchema, insertUserFavoriteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Sessions routes
  app.get("/api/sessions", async (req, res) => {
    try {
      const { category, type } = req.query;
      let sessions;
      
      if (category) {
        sessions = await storage.getSessionsByCategory(category as string);
      } else if (type) {
        sessions = await storage.getSessionsByType(type as string);
      } else {
        sessions = await storage.getAllSessions();
      }
      
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // User progress routes
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createProgress(validatedData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create progress" });
    }
  });

  app.patch("/api/progress/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const progress = await storage.updateProgress(id, updates);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const favorites = await storage.getUserFavorites(req.params.userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertUserFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(validatedData);
      res.json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:userId/:sessionId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const sessionId = req.params.sessionId;
      const removed = await storage.removeFavorite(userId, sessionId);
      
      if (!removed) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      res.json({ message: "Favorite removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Stats routes
  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.patch("/api/stats/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const updates = req.body;
      const stats = await storage.updateUserStats(userId, updates);
      
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to update stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
