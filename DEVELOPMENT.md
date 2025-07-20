# Wellness Meditation App - Development Guide

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (optional for local development)

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd wellness-meditation-app
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials if using PostgreSQL
   ```

3. **Database Setup (Optional):**
   ```bash
   # Push schema to database
   npm run db:push
   ```

4. **Development:**
   ```bash
   # Start both backend API and frontend dev server
   npm run dev
   
   # Or run separately:
   npm run dev:backend  # Express API server on port 5000
   npm run dev:frontend # Vite dev server with HMR
   ```

5. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
wellness-meditation-app/
├── src/                    # React frontend source
│   ├── App.tsx            # Main app component with routing
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── SessionsScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── styles/            # CSS stylesheets
│   │   └── modern.css     # Modern mobile-first design
│   └── main.tsx          # React app entry point
├── server/                # Express backend
│   ├── index.ts          # Main server file
│   ├── routes.ts         # API routes
│   ├── db.ts            # Database connection
│   └── storage.ts       # Data access layer
├── shared/               # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── index.html           # HTML entry point
```

## Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Styling:** Modern CSS with CSS variables and responsive design
- **Icons:** Lucide React for consistent iconography
- **State:** React hooks for local state management
- **Build:** Vite for fast development and optimized builds

### Backend
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Session-based (simplified for development)
- **API:** RESTful endpoints for meditation sessions, user progress

### Design System
- **Color Palette:** Indigo primary with complementary accent colors
- **Typography:** Inter font family for modern readability
- **Layout:** Mobile-first responsive design (max-width: 430px)
- **Animations:** Smooth transitions and hover effects
- **Components:** Card-based layout with consistent spacing

## Features

### Implemented
✅ **Home Dashboard**
- Dynamic greeting based on time of day
- Progress tracking with visual progress bars
- Quick action cards for immediate meditation/workout access
- Real-time stats display

✅ **Meditation Sessions**
- Search and filter functionality
- Category-based organization
- Instructor information and ratings
- Session metadata (duration, difficulty, play count)
- Modern card-based UI with gradient backgrounds

✅ **User Profile**
- Comprehensive user statistics
- Achievement system with progress tracking
- Settings management
- Weekly goal progress visualization

✅ **Modern UI/UX**
- Smooth animations and micro-interactions
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Accessibility considerations

### Future Enhancements
- [ ] Audio playback integration
- [ ] User authentication with multiple providers
- [ ] Social features and community
- [ ] Offline mode support
- [ ] Push notifications
- [ ] Analytics and insights

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices with hooks
- Implement responsive design principles
- Use semantic HTML elements
- Include hover and focus states for interactivity

### Component Structure
```tsx
// Example component structure
import React, { useState, useEffect } from 'react';
import { Icon1, Icon2 } from 'lucide-react';

export default function ComponentName() {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className="component-container">
      {/* Component JSX */}
    </div>
  );
}
```

### CSS Conventions
- Use CSS custom properties for theming
- Follow BEM-like naming for CSS classes
- Implement mobile-first responsive design
- Use CSS Grid and Flexbox for layouts
- Include smooth transitions for interactions

## Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Assets optimized
- [ ] HTTPS configured
- [ ] Error monitoring setup
- [ ] Performance monitoring

### Replit Deployment
The app is configured for easy deployment on Replit:
1. Connect your repository
2. Set environment variables
3. Run `npm run dev` to start the application
4. Access via the provided Replit URL

### External Deployment
For deployment outside Replit:
1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start the production server: `npm start`
5. Set up reverse proxy (nginx/Apache) if needed

## API Documentation

### Endpoints
- `GET /api/sessions` - Retrieve meditation sessions
- `GET /api/auth/user` - Get current user info
- `GET /api/progress` - Get user progress data

### Database Schema
See `shared/schema.ts` for complete database schema definitions including:
- Users and sessions
- Meditation sessions and categories
- User progress and achievements
- Settings and preferences

## Troubleshooting

### Common Issues
1. **Port conflicts:** Ensure port 5000 is available
2. **Database connection:** Check PostgreSQL credentials
3. **Build errors:** Clear node_modules and reinstall
4. **TypeScript errors:** Check type definitions and imports

### Performance Optimization
- Use React.memo for expensive components
- Implement lazy loading for images
- Optimize CSS with critical path rendering
- Use service workers for caching (future enhancement)

## Contributing

1. Follow existing code style and patterns
2. Write descriptive commit messages
3. Test on multiple screen sizes
4. Ensure accessibility compliance
5. Update documentation as needed