# Mindful - Meditation & Wellness Platform

A comprehensive meditation and wellness platform built with modern web technologies. Features guided meditation sessions, sleep stories, workout routines, daily goal tracking, and user progress analytics.

## Features

### 🧘 Meditation & Mindfulness
- Guided meditation sessions with real audio
- Custom meditation timer with circular progress
- Sessions categorized by focus, stress relief, and sleep
- Different difficulty levels (beginner, intermediate, advanced)

### 😴 Sleep & Relaxation
- Sleep stories and calming soundscapes
- Continuous ambient sounds (ocean waves, forest rain)
- Bedtime preparation routines

### 💪 Fitness & Workouts
- Yoga, strength training, and cardio workouts
- Video-guided exercise routines
- Equipment tracking and difficulty levels
- Progress tracking for fitness goals

### 🎯 Daily Goals & Habits
- Customizable daily goals for meditation, exercise, gratitude, and hydration
- Progress tracking with visual indicators
- Achievement system and streak tracking
- Goal completion celebrations

### 📊 Progress Analytics
- Detailed statistics and progress insights
- Streak tracking and achievement badges
- Weekly and total minute tracking
- Favorite category analysis

### ⚙️ User Management
- Google OAuth authentication
- Comprehensive user settings
- Theme customization (light/dark/system)
- Notification preferences
- Language and timezone settings

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **TanStack Query** for state management and caching
- **Wouter** for routing
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Neon serverless
- **Drizzle ORM** for database operations
- **Passport.js** with Google OAuth2
- **Express Sessions** with PostgreSQL store

### Database
- **PostgreSQL** with comprehensive schema
- User management and authentication
- Session and progress tracking
- Daily goals and workout data
- Audio file management
- User settings and preferences

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindful-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/mindful_db
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   
   # Session
   SESSION_SECRET=your_secure_session_secret
   
   # Environment
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## Environment Setup

### Google OAuth Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`

### Database Setup
The application uses PostgreSQL with the following main tables:
- `users` - User profiles and authentication
- `meditation_sessions` - Meditation content library
- `workouts` - Exercise and workout routines
- `user_progress` - Session completion tracking
- `daily_goals` - Daily habit tracking
- `user_settings` - User preferences
- `user_favorites` - Favorited content
- `user_stats` - Progress analytics

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Update your environment variables for production:
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
SESSION_SECRET=your_production_session_secret
```

### Deployment Platforms

#### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

#### Railway
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will automatically detect and deploy your app

#### Heroku
1. Create a new Heroku app
2. Add the Heroku PostgreSQL add-on
3. Set environment variables using Heroku CLI or dashboard
4. Deploy using Git push

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/user` - Get current user
- `GET /api/logout` - Logout user

### Sessions
- `GET /api/sessions` - Get all meditation sessions
- `GET /api/sessions?category=focus` - Get sessions by category
- `GET /api/sessions/:id` - Get specific session

### Workouts
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts?category=yoga` - Get workouts by category
- `GET /api/workouts/:id` - Get specific workout

### Progress
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Create progress entry
- `PATCH /api/progress/:id` - Update progress

### Daily Goals
- `GET /api/goals/:userId/:date` - Get daily goals
- `PATCH /api/goals/:userId/:date` - Update daily goals

### User Settings
- `GET /api/settings/:userId` - Get user settings
- `PATCH /api/settings/:userId` - Update user settings

## Features Overview

### Authentication Flow
1. User clicks "Sign In with Google"
2. Redirected to Google OAuth consent screen
3. After authorization, user data is stored in database
4. Session is created and user is redirected to home page
5. Protected routes check authentication status

### Session Management
- Meditation sessions with real audio streaming
- Progress tracking with time spent and completion status
- Favorite sessions for quick access
- Custom meditation timer with breathing guidance

### Workout System
- Video-based workout routines
- Equipment and instruction tracking
- Multiple categories: yoga, strength, cardio
- Integration with daily fitness goals

### Goal Tracking
- Daily targets for meditation, exercise, gratitude, and hydration
- Real-time progress updates
- Achievement celebrations
- Historical progress analytics

### User Experience
- Responsive design for all devices
- Dark/light theme support
- Smooth animations and transitions
- Offline-capable design
- Progressive Web App features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API endpoints and examples

## Roadmap

### Upcoming Features
- [ ] Social features and community sharing
- [ ] Personalized recommendations using AI
- [ ] Offline mode with downloadable content
- [ ] Apple Health and Google Fit integration
- [ ] Advanced analytics and insights
- [ ] Subscription management
- [ ] Multi-language support
- [ ] Mobile app development

---

Built with ❤️ for mindfulness and wellness enthusiasts.