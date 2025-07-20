import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || "your-session-secret-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Simple auth routes without OAuth
  app.get("/api/auth/user", (req, res) => {
    // Return a mock user for development
    res.json({
      id: "dev-user-1",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null
    });
  });

  app.get("/api/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  // Allow all requests through in development without authentication
  return next();
};