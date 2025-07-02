# DataFlow Owner Console

## Overview

This is a full-featured React application built to serve as an Owner Console for DataFlow, a multi-tenant data pipeline management platform. The application provides comprehensive administrative control over tenants, pipelines, system configuration, security, billing, and analytics through a modern web interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with CSS custom properties for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: SQLite with Drizzle ORM (migrated from PostgreSQL for offline use)
- **Authentication**: Simple local authentication (migrated from Replit OIDC for offline use)
- **Session Storage**: In-memory session handling
- **API Design**: RESTful API with simple role-based access control

### Build System
- **Bundler**: Vite for development and production builds
- **Development**: Hot module replacement with Vite dev server
- **Production**: ESBuild for server bundling, Vite for client assets
- **Type Checking**: TypeScript with strict mode enabled

## Key Components

### Authentication & Authorization
- Replit OIDC-based authentication system
- Role-based access control (owner, admin, support roles)
- Session management with PostgreSQL storage
- Protected routes requiring specific roles for access

### Database Schema
- **Users**: Authentication and role management
- **Tenants**: Customer organization management
- **Pipelines**: Data pipeline tracking and configuration
- **System Metrics**: Real-time system health monitoring
- **Audit Logs**: Security and activity tracking
- **Invoices & Plans**: Billing and subscription management

### UI Components
- Collapsible sidebar navigation with responsive design
- Role-based page access and content filtering
- Real-time data updates with automatic refresh intervals
- Comprehensive form handling with validation
- Interactive charts and metrics dashboards

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit OIDC, sessions stored in PostgreSQL
2. **Authorization Check**: Role verification on both client and server sides
3. **Data Fetching**: TanStack Query manages API calls with caching and automatic refetching
4. **Real-time Updates**: Polling intervals for system metrics and live data
5. **State Management**: Server state cached and synchronized across components

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **express**: Node.js web framework
- **openid-client**: OIDC authentication implementation

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Static type checking
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Server**: Development server runs on Node.js with tsx for TypeScript execution
- **Client**: Vite dev server with HMR for rapid development
- **Database**: PostgreSQL with Drizzle migrations for schema management

### Production Build
- **Client Build**: Vite builds optimized static assets to `dist/public`
- **Server Build**: ESBuild bundles server code to `dist/index.js`
- **Database**: Production PostgreSQL with connection pooling
- **Static Serving**: Express serves built client assets in production

### Configuration
- Environment variables for database connection and authentication
- Drizzle configuration for database migrations and schema management
- Vite configuration with path aliases and build optimization

## Changelog

```
Changelog:
- July 02, 2025. Successfully migrated from Replit Agent to Replit environment
  - Created environment variables documentation (env.txt)
  - Added local development setup guide (run.md)
  - Verified project compatibility and security practices
  - Confirmed client/server separation architecture
- July 01, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```