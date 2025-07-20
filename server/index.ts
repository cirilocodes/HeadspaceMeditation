import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import fs from 'fs';
import path from 'path';

function log(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [express] ${message}`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve built React app from dist directory if it exists, otherwise serve development files
  
  const distPath = path.join(process.cwd(), 'dist');
  const hasBuild = fs.existsSync(distPath);
  
  if (hasBuild) {
    // Production: serve built files
    app.use(express.static('dist'));
    app.get("/", (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
    
    // Handle React routing for production
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile('index.html', { root: 'dist' });
      }
    });
  } else {
    // Development: serve source files with proper MIME types
    app.use((req, res, next) => {
      if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
        res.type('application/javascript');
      } else if (req.path.endsWith('.tsx') || req.path.endsWith('.ts')) {
        res.type('application/javascript');
      } else if (req.path.endsWith('.css')) {
        res.type('text/css');
      }
      next();
    });

    app.use(express.static('.', {
      setHeaders: (res, path) => {
        if (path.endsWith('.js') || path.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    }));
    
    app.get("/", (req, res) => {
      res.sendFile('index.html', { root: '.' });
    });

    // Handle React routing for development
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api') && !req.path.includes('.')) {
        res.sendFile('index.html', { root: '.' });
      }
    });
  }
  
  // API endpoint info for development
  app.get("/api", (req, res) => {
    res.json({ 
      message: "Wellness Meditation API Server", 
      version: "1.0.0",
      endpoints: ["/api/sessions", "/api/auth/user", "/api/progress"]
    });
  });

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
