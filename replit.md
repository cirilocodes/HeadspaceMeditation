# Wellness & Meditation App

## Project Overview
A full-stack wellness application featuring meditation sessions, workouts, user progress tracking, and daily goals. Built with React/TypeScript frontend and Express backend using PostgreSQL for data persistence.

## Architecture
- Frontend: React with TypeScript, Vite, Tailwind CSS, shadcn/ui components
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Drizzle ORM
- Authentication: Google OAuth and local authentication with Passport.js
- State Management: TanStack Query for server state

## Key Features
- Meditation sessions with audio playback
- Workout videos and instructions
- User progress tracking and statistics
- Daily goals and habit tracking
- User favorites and personalized recommendations
- Audio file management
- User settings and preferences

## Recent Changes
- 2025-01-20: Project migrated from Replit Agent to Replit environment
- 2025-01-20: PostgreSQL database provisioned for production use
- 2025-01-20: Security configurations updated for Replit deployment

## Database Schema
The app uses a comprehensive schema with tables for:
- Users and authentication sessions
- Meditation sessions and workouts
- User progress, favorites, and statistics
- Daily goals and audio files
- User settings and preferences

## User Preferences
None specified yet.

## Development Setup
- Uses `npm run dev` to start both frontend and backend
- Database migrations handled through Drizzle Kit
- Environment configured for 0.0.0.0:5000 binding