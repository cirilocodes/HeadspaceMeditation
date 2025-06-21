# Installation & Setup Guide

This guide will help you set up and run the Mindful meditation app locally and prepare it for production deployment.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database (local or cloud)
- Google Cloud Console account
- Git

## Quick Setup

### 1. Clone and Install
```bash
git clone <your-repository-url>
cd mindful-app
npm install
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/mindful_db

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session Security
SESSION_SECRET=your_secure_random_string_at_least_32_characters_long

# Application
NODE_ENV=development
PORT=5000
```

### 3. Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing

2. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Search and enable "Google+ API"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:5000/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`

4. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add them to your `.env` file

### 4. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb mindful_db
sudo -u postgres createuser --interactive mindful_user

# Set password
sudo -u postgres psql
ALTER USER mindful_user PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mindful_db TO mindful_user;
\q
```

#### Option B: Cloud Database (Recommended)
- **Neon**: [neon.tech](https://neon.tech) - Free tier available
- **Supabase**: [supabase.com](https://supabase.com) - Free tier available
- **PlanetScale**: [planetscale.com](https://planetscale.com) - Free tier available

### 5. Initialize Database
```bash
npm run db:push
```

### 6. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Production Setup

### 1. Build Application
```bash
npm run build
```

### 2. Production Environment
Update your `.env` for production:
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
SESSION_SECRET=your_production_session_secret
```

### 3. Start Production Server
```bash
npm start
```

## Verification Steps

### 1. Test Authentication
- Visit the app
- Click "Sign In with Google"
- Complete OAuth flow
- Verify user profile appears

### 2. Test Core Features
- [ ] Browse meditation sessions
- [ ] Play audio (if available)
- [ ] Check sleep content
- [ ] Try workout videos
- [ ] Set daily goals
- [ ] View progress stats

### 3. Test Settings
- [ ] Open profile modal
- [ ] Access account settings
- [ ] Change theme preferences
- [ ] Update notification settings

## Troubleshooting

### Common Issues

1. **OAuth Error "redirect_uri_mismatch"**
   - Check Google Cloud Console redirect URIs
   - Ensure GOOGLE_CALLBACK_URL matches exactly

2. **Database Connection Failed**
   - Verify DATABASE_URL format
   - Check database server is running
   - Ensure database exists and user has permissions

3. **Session Issues**
   - Ensure SESSION_SECRET is set and secure
   - Check session table exists in database

4. **Audio/Video Not Playing**
   - External URLs may not work in development
   - Check browser console for CORS errors

### Debug Commands

```bash
# Check environment variables
printenv | grep -E "(DATABASE|GOOGLE|SESSION)"

# Test database connection
npm run db:push

# Check application logs
npm run dev
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push      # Push schema changes
npm run db:generate  # Generate migrations
npm run db:studio    # Open database studio

# Type checking
npm run type-check

# Linting
npm run lint
```

## File Structure

```
mindful-app/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility functions
├── server/             # Backend Express application
│   ├── index.ts        # Main server file
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database operations
│   ├── googleAuth.ts   # Authentication logic
│   └── db.ts          # Database connection
├── shared/             # Shared types and schemas
│   └── schema.ts       # Database schema and types
├── README.md           # Main documentation
├── DEPLOYMENT.md       # Deployment guide
└── package.json        # Dependencies and scripts
```

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret | `GOCSPX-abcdef123456` |
| `GOOGLE_CALLBACK_URL` | Yes | OAuth redirect URI | `http://localhost:5000/api/auth/google/callback` |
| `SESSION_SECRET` | Yes | Session encryption key | `your-32-character-random-string` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `PORT` | No | Server port | `5000` |

## Support

If you encounter issues:

1. Check this installation guide
2. Review the troubleshooting section
3. Check environment variables are set correctly
4. Verify Google OAuth configuration
5. Test database connectivity

For deployment-specific issues, see `DEPLOYMENT.md`.