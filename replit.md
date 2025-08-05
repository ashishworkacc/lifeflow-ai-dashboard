# LifeFlow AI Dashboard

## Overview

LifeFlow AI Dashboard is a modern productivity application designed to be a personal headquarters for goals, habits, health tracking, thoughts, and AI insights. The application provides an interactive, visually appealing dashboard that motivates users to stay productive through smooth animations, dark glassy cards, and instant updates. It's built as a full-stack TypeScript application with a focus on user experience and real-time interaction.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI primitives with shadcn/ui components for consistent, accessible interface
- **Styling**: Tailwind CSS with custom CSS variables for theming and a dark-first design approach
- **Animations**: Framer Motion for smooth transitions and celebratory feedback
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design with structured error handling
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for efficient bundling and deployment

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless database
- **Schema Management**: Shared schema definitions between client and server
- **Development Storage**: In-memory storage implementation for rapid prototyping
- **Migration**: Drizzle-kit for database schema migrations

### Authentication and Authorization
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Built-in user system with demo user for development
- **Security**: Environment-based configuration for database credentials

### Core Features Architecture
- **Dashboard**: Unified view aggregating tasks, habits, health metrics, goals, notes, and time blocks
- **Tasks**: Priority-based task management with completion tracking
- **Habits**: Streak tracking with visual feedback and customizable colors/emojis
- **Health Metrics**: Multi-type health data logging (sleep, steps, water, weight, etc.)
- **Goals**: Progress tracking with visual indicators
- **Notes**: Quick note-taking with tagging capabilities
- **Time Blocks**: Schedule management with color-coded blocks
- **AI Insights**: Motivational and analytical insights (currently mock data)

### Development Experience
- **Hot Reload**: Vite HMR for instant feedback during development
- **Type Safety**: End-to-end TypeScript with shared types between client and server
- **Path Aliases**: Configured aliases for clean import statements
- **Error Handling**: Runtime error overlay for development debugging

## External Dependencies

### UI and Design
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Framer Motion**: Animation library for smooth user interactions
- **Lucide React**: Icon library for consistent iconography

### Data and State Management
- **TanStack Query**: Server state management with caching and background updates
- **Drizzle ORM**: Type-safe database toolkit
- **Drizzle Zod**: Schema validation integration
- **React Hook Form**: Form state management with validation

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **esbuild**: JavaScript bundler for production builds
- **tsx**: TypeScript execution for development
- **PostCSS**: CSS processing with Tailwind CSS

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL database
- **connect-pg-simple**: PostgreSQL session store for Express

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class management
- **class-variance-authority**: Type-safe CSS class variants
- **nanoid**: Unique ID generation