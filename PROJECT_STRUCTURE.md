# Project Structure & Architecture

This document provides a comprehensive overview of the Mindful meditation app's architecture, file organization, and key components.

## Overview

The Mindful app is a full-stack TypeScript application built with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: Google OAuth 2.0
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Platform-agnostic (Vercel, Railway, Heroku, etc.)

## Directory Structure

```
mindful-app/
├── client/                 # Frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── audio-player.tsx
│   │   │   ├── daily-goals.tsx
│   │   │   ├── meditation-timer.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── profile-modal.tsx
│   │   │   ├── progress-stats.tsx
│   │   │   ├── search-modal.tsx
│   │   │   ├── session-card.tsx
│   │   │   ├── settings-modal.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── workout-card.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── use-toast.ts
│   │   │   ├── use-mobile.tsx
│   │   │   └── useAuth.ts
│   │   ├── lib/           # Utility functions
│   │   │   ├── audio-manager.ts
│   │   │   ├── authUtils.ts
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── pages/         # Page components
│   │   │   ├── home.tsx
│   │   │   ├── landing.tsx
│   │   │   └── not-found.tsx
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML template
│   └── vite.config.ts     # Vite configuration
├── server/                # Backend application
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database operations
│   ├── googleAuth.ts     # Google OAuth implementation
│   ├── db.ts            # Database connection
│   └── vite.ts          # Vite development setup
├── shared/               # Shared code between client/server
│   └── schema.ts        # Database schema and TypeScript types
├── docs/                # Documentation
│   ├── README.md
│   ├── INSTALLATION.md
│   ├── DEPLOYMENT.md
│   └── PROJECT_STRUCTURE.md
├── config files
│   ├── .env.example     # Environment variables template
│   ├── components.json  # shadcn/ui configuration
│   ├── drizzle.config.ts # Database configuration
│   ├── package.json     # Dependencies and scripts
│   ├── tailwind.config.ts # TailwindCSS configuration
│   ├── tsconfig.json    # TypeScript configuration
│   ├── tsconfig.server.json # Server TypeScript config
│   └── vite.config.ts   # Vite build configuration
```

## Architecture Overview

### Frontend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │    │   Home Page     │    │  Profile Modal  │
│                 │    │                 │    │                 │
│  - Hero section │    │  - Navigation   │    │  - User info    │
│  - Features     │────▶  - Tab content  │────▶  - Settings    │
│  - CTA buttons  │    │  - Audio player │    │  - Logout       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌─────────────────┐
│ Authentication  │    │  Content Tabs   │
│                 │    │                 │
│ - Google OAuth  │    │ - Meditate      │
│ - Session mgmt  │    │ - Sleep         │
│ - User context  │    │ - Workouts      │
└─────────────────┘    │ - Goals         │
                       │ - Progress      │
                       └─────────────────┘
```

### Backend Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Routes    │    │   Storage       │    │   Database      │
│                 │    │                 │    │                 │
│ - Auth endpoints│────▶ - User ops      │────▶ - PostgreSQL   │
│ - CRUD APIs     │    │ - Session mgmt  │    │ - Drizzle ORM   │
│ - Middleware    │    │ - Progress      │    │ - Migrations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Authentication  │
│                 │
│ - Google OAuth  │
│ - Passport.js   │
│ - Session store │
└─────────────────┘
```

## Key Components

### Frontend Components

#### Core Pages
- **Landing Page** (`client/src/pages/landing.tsx`)
  - Hero section with sign-in flow
  - Feature showcase
  - Call-to-action buttons

- **Home Page** (`client/src/pages/home.tsx`)
  - Main application interface
  - Tab-based navigation
  - Content sections for each feature

#### UI Components
- **SessionCard** - Displays meditation/sleep content
- **WorkoutCard** - Shows exercise routines
- **AudioPlayer** - Plays meditation audio with controls
- **MeditationTimer** - Custom timer with circular progress
- **DailyGoals** - Goal tracking interface
- **ProgressStats** - Analytics and achievements
- **SettingsModal** - User preferences management

#### Utility Components
- **Navigation** - Tab switching logic
- **SearchModal** - Content search functionality
- **ProfileModal** - User profile management
- **ThemeProvider** - Dark/light mode support

### Backend Components

#### Core Modules
- **Routes** (`server/routes.ts`)
  - RESTful API endpoints
  - Request validation
  - Error handling

- **Storage** (`server/storage.ts`)
  - Database abstraction layer
  - CRUD operations
  - Data validation

- **Authentication** (`server/googleAuth.ts`)
  - Google OAuth integration
  - Session management
  - Route protection

#### Database Schema
```sql
-- Core Tables
users              # User profiles and auth data
meditation_sessions # Content library
workouts           # Exercise routines
daily_goals        # Habit tracking
user_progress      # Completion tracking
user_favorites     # Saved content
user_stats         # Analytics data
user_settings      # Preferences
audio_files        # Media metadata
sessions           # Auth sessions
```

## Data Flow

### Authentication Flow
```
1. User clicks "Sign In with Google"
2. Redirect to Google OAuth
3. Google returns user data
4. Create/update user in database
5. Create session
6. Redirect to home page
```

### Content Flow
```
1. User selects content tab
2. Fetch data from API
3. Display in appropriate cards
4. User interaction (play/favorite)
5. Update progress/stats
6. Persist to database
```

### Real-time Updates
```
1. User completes action
2. Optimistic UI update
3. API call to backend
4. Database update
5. Cache invalidation
6. UI refresh
```

## State Management

### Client-side State
- **TanStack Query** for server state
- **React Context** for auth state
- **Local State** for UI interactions
- **Browser Storage** for preferences

### Server-side State
- **PostgreSQL** for persistent data
- **Express Sessions** for auth state
- **Memory Cache** for frequently accessed data

## Security Implementation

### Authentication
- Google OAuth 2.0 integration
- Secure session management
- CSRF protection
- Route-level access control

### Data Protection
- Environment variable secrets
- Database connection encryption
- Input validation and sanitization
- SQL injection prevention

### Frontend Security
- XSS prevention
- Secure cookie handling
- HTTPS enforcement
- Content Security Policy headers

## Performance Optimizations

### Frontend
- Code splitting by routes
- Lazy loading components
- Image optimization
- Bundle size optimization
- React Query caching

### Backend
- Database connection pooling
- Query optimization
- Response compression
- Caching strategies

### Database
- Proper indexing
- Query optimization
- Connection management
- Migration strategies

## Development Workflow

### Local Development
```bash
1. npm install          # Install dependencies
2. cp .env.example .env  # Setup environment
3. npm run db:push      # Initialize database
4. npm run dev          # Start development
```

### Code Organization
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

### Testing Strategy
- Unit tests for utilities
- Integration tests for API
- Component tests for UI
- End-to-end testing

## Deployment Architecture

### Build Process
```
1. npm run build        # Build client and server
2. Database migration   # Update schema
3. Environment setup    # Configure variables
4. Health checks        # Verify deployment
```

### Infrastructure
- Stateless server design
- Database connection pooling
- Session store in database
- CDN for static assets

## API Design

### RESTful Endpoints
```
Authentication:
GET  /api/auth/user              # Get current user
GET  /api/auth/google            # OAuth login
GET  /api/auth/google/callback   # OAuth callback
GET  /api/logout                 # User logout

Content:
GET  /api/sessions               # List sessions
GET  /api/sessions/:id           # Get session
GET  /api/workouts               # List workouts
GET  /api/workouts/:id           # Get workout

User Data:
GET  /api/progress/:userId       # User progress
POST /api/progress               # Create progress
GET  /api/favorites/:userId      # User favorites
POST /api/favorites              # Add favorite
GET  /api/stats/:userId          # User statistics
GET  /api/goals/:userId/:date    # Daily goals
```

### Response Format
```json
{
  "data": { ... },
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Handling
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

## Scalability Considerations

### Horizontal Scaling
- Stateless server design
- Load balancer compatible
- Database connection pooling
- Session store externalization

### Performance Monitoring
- Response time tracking
- Error rate monitoring
- Database query analysis
- User experience metrics

## Future Enhancements

### Planned Features
- Mobile app development
- Offline content support
- Social features
- AI-powered recommendations
- Payment processing
- Advanced analytics

### Technical Improvements
- GraphQL API
- Microservices architecture
- Redis caching
- ElasticSearch integration
- Real-time notifications
- Progressive Web App features

This architecture provides a solid foundation for a production-ready meditation and wellness platform with room for future growth and enhancements.