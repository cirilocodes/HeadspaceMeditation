# Wellness & Meditation App

## Project Overview
A mobile wellness application featuring meditation sessions, workouts, user progress tracking, and daily goals. Built with React Native frontend and Express backend using PostgreSQL for data persistence.

## Architecture
- Frontend: React Native with TypeScript
- Backend: Express.js with TypeScript API server
- Database: PostgreSQL with Drizzle ORM
- Authentication: Simplified session-based auth
- State Management: React Native async storage and context

## Key Features
- Meditation sessions with audio playback
- Workout videos and instructions
- User progress tracking and statistics
- Daily goals and habit tracking
- User favorites and personalized recommendations
- Audio file management
- User settings and preferences

## Recent Changes
- 2025-07-20: Project migrated from Replit Agent to Replit environment
- 2025-07-20: PostgreSQL database provisioned for production use
- 2025-07-20: Google OAuth authentication completely removed for simplified development
- 2025-07-20: Mobile-style web app created with modern, sophisticated design
- 2025-07-20: Interactive UI with search, filtering, progress tracking implemented
- 2025-07-20: Lucide React icons integrated for professional appearance
- 2025-07-20: Development setup optimized for external development
- 2025-07-20: Modern CSS design system with animations and responsive layout

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
- Backend API server: `npm run dev` (runs on port 5000)
- React Native app: `npx expo start` (runs on expo development server)
- Database migrations handled through Drizzle Kit
- Backend configured for 0.0.0.0:5000 binding
- React Native app connects to backend API