import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Google OAuth credentials are optional in development
const hasGoogleCredentials = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

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
  app.use(passport.initialize());
  app.use(passport.session());

  // Only setup Google OAuth if credentials are available
  if (hasGoogleCredentials) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await storage.upsertUser({
          id: profile.id,
          email: profile.emails?.[0]?.value || null,
          firstName: profile.name?.givenName || null,
          lastName: profile.name?.familyName || null,
          profileImageUrl: profile.photos?.[0]?.value || null,
        });
        
        return done(null, { ...user, accessToken, refreshToken });
      } catch (error) {
        return done(error, null);
      }
    }));

    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await storage.getUser(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });

    // Auth routes - only if Google OAuth is configured
    app.get("/api/auth/google", 
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get("/api/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/");
      }
    );
  } else {
    // Development fallback when no Google credentials
    app.get("/api/auth/google", (req, res) => {
      res.status(501).json({ message: "Google OAuth not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables." });
    });

    app.get("/api/auth/google/callback", (req, res) => {
      res.status(501).json({ message: "Google OAuth not configured." });
    });
  }

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  // In development without Google OAuth, allow all requests through
  if (!hasGoogleCredentials && process.env.NODE_ENV === "development") {
    return next();
  }
  
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};