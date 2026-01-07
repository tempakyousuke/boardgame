# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based board game platform built with SvelteKit, designed to play custom board games online with friends. The current focus is "Tetsudo" (鉄道ゲーム), a Momotaro Dentetsu-style multiplayer board game.

## Commands

```bash
# Development
npm run dev              # Start dev server (Vite)
npm run build            # Production build
npm run preview          # Preview production build

# Type checking
npm run check            # Type check with svelte-check
npm run check:watch      # Type check in watch mode

# Code quality
npm run lint             # Prettier check + ESLint
npm run format           # Format with Prettier

# Database (PostgreSQL via Docker)
npm run db:start         # Start PostgreSQL container (docker compose up)
npm run db:push          # Push schema changes to database
npm run db:generate      # Generate migration files
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio
```

## Tech Stack

- **Frontend**: SvelteKit 2, Svelte 5, TailwindCSS 4
- **Backend**: SvelteKit server routes
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Custom session-based authentication using @oslojs/crypto (Argon2 for passwords)

## Architecture

### Database Schema (`src/lib/server/db/schema.ts`)

Tables use Drizzle ORM with PostgreSQL. Game-specific tables use `tetsudo_` prefix:
- `user`, `session` - Authentication
- `tetsudo_squares` - Board squares (type: blue/red/property/card/start)
- `tetsudo_paths` - Connections between squares
- `tetsudo_properties` - Purchasable properties on squares

### Authentication Flow

- Session management in `src/lib/server/auth.ts`
- Server hook (`src/hooks.server.ts`) validates session tokens on each request
- User/session available via `event.locals.user` and `event.locals.session`

### Route Structure

- `/login`, `/register`, `/logout` - Auth flows
- `/change-name`, `/change-password` - User settings
- `/tetsudo` - Game lobby and rooms
- `/tetsudo/admin/map` - Map editor for game board
- `/api/tetsudo/admin/*` - API endpoints for squares, paths, properties
- `/admin-secret-dashboard` - Admin dashboard (requires `isAdmin` flag)

### Key Patterns

- Server-side logic in `+page.server.ts` and `+server.ts` files
- Form actions for mutations (SvelteKit form actions)
- API routes return JSON for client-side operations (e.g., map editor)

## Environment Setup

1. Copy `.env.example` to `.env`
2. Run `npm run db:start` to start PostgreSQL
3. Run `npm run db:push` to create tables
4. Run `npm run dev` to start development server
