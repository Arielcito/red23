# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Setup

This is a Next.js 15 project using React 19 with TypeScript and Tailwind CSS 4. The project follows Next.js App Router architecture with Supabase as database and deploys to Vercel.

## Development Commands

- `ppm run dev` - Start development server with Turbopack
- `ppm run build` - Build production version
- `ppm run start` - Start production server
- `ppm run lint` - Run ESLint
- `npx tsc --noEmit` - Type check without emitting files (run after completing tasks)

## Architecture

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with PostCSS
- **Database**: Supabase
- **Deployment**: Vercel
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Path aliases**: `@/*` maps to `./src/*`

### Project Structure
- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with font configuration
- `src/app/page.tsx` - Homepage
- `src/app/globals.css` - Global styles with Tailwind and CSS variables
- `public/` - Static assets

## Frontend Guidelines

### Folder Structure
- `/src`
    - `/components`
        - `/domain`
            - `/hooks`
            - `/types`
            - `/utils`
            - `/components`
                - `specific-component-1.tsx`
                - `specific-component-2.tsx`
            - `domain.tsx`
    - `/app` (Next.js App Router)
        - `/domain`
            - `/hooks`
            - `/utils`
            - `/types`
            - `/components`
                - `specific-component-1.tsx`
                - `specific-component-2.tsx`
                - `/complex-component`
                    - `/hooks`
                    - `/utils`
                    - `/types`
                    - `index.ts`
            - `/[sub-domain]` -> dynamic routes. For example /contents/[user-id]
                - `/hooks`
                - `/utils`
                - `/types`
                - `page.tsx`
            - `page.tsx`

### Data Fetching
Use TanStack Query with useQuery/useMutation. Handle errors with onError callback. Use Axios for HTTP requests.

### Component Guidelines
- Create atomic components that are reusable and focused on single responsibility
- Use TypeScript interfaces for props, preferably with Zod schemas when validation is needed
- Implement proper prop destructuring with default values
- Export components as default exports from their files

### State Management
- All data handling in React must be in custom hooks
- Use React's built-in useState and useReducer for local state
- Use TanStack Query for server state management
- Create custom hooks for complex logic or shared state

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow mobile-first responsive design approach
- Use CSS variables for theming (already configured in globals.css)
- Avoid inline styles unless absolutely necessary

### Authentication & Security
- Handle authentication through backend API endpoints (login, register, logout)
- Store authentication tokens securely (httpOnly cookies or secure localStorage)
- Implement proper route protection with middleware or guards
- Use TanStack Query for auth state management
- Never expose sensitive data in client-side code
- Use environment variables for configuration

### Performance Guidelines  
- Use Next.js Image component for optimized images
- Implement lazy loading for heavy components
- Use React.memo for expensive components that don't need frequent re-renders
- Optimize bundle size by importing only what's needed

### TypeScript Guidelines
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper typing for API responses
- Avoid 'any' type - use 'unknown' when type is truly unknown

### UI Guidelines
- Always include loading states
- Always include empty states
- Handle errors properly - check error type for specific messages
- Show loading state while data is being fetched

### Forms
Use react-hook-form with Zod for validation. Show validation errors BELOW the input fields.

## Backend/API Guidelines (Next.js API Routes)

### Folder Structure
Organize API routes by domain using Next.js App Router:

- `/src/app/api`
  - `/domain`
    - `route.ts` (GET, POST, etc.)
    - `/[id]`
      - `route.ts`
    - `/sub-domain`
      - `route.ts`

### Database Communication
- All database operations through Supabase backend
- Use snake_case for table/column names
- Include `created_at` and `updated_at` in all tables
- Define foreign keys with appropriate delete conditions (cascade, null, etc.)
- Use `jsonb` for JSON data storage
- Handle database errors appropriately in API routes

### API Routes Structure
Each route file should handle specific HTTP methods:

```tsx
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    // Handle GET requests
}

export async function POST(request: NextRequest) {
    // Handle POST requests
}
```

### Endpoints Naming
1. Use plural nouns: `/api/users`, `/api/orders`
2. Use proper HTTP methods:
   - GET `/api/users` → Get list
   - POST `/api/users` → Create
   - GET `/api/users/[id]` → Get one
   - PUT `/api/users/[id]` → Update
   - DELETE `/api/users/[id]` → Delete
3. Use kebab-case in routes: `/api/user-groups`
4. Query params for filtering: `/api/users?status=active&sort=name`

### API Responses
Successful response:
```tsx
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Example"
  }
}
```

Error response:
```tsx
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "There was an error processing the form",
    "details": [
      "Email is mandatory",
      "Password must have at least 8 characters"
    ]
  }
}
```

Pagination response:
```tsx
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "perPage": 10,
    "totalPages": 10
  }
}
```

### Error Handling
Use proper HTTP status codes and structured error responses. Log errors appropriately using console.error with context.

### Environment Variables
- Use `.env.local` for local development
- Prefix client-side variables with `NEXT_PUBLIC_`
- Use Vercel environment variables for production
- Never commit sensitive variables to repository

### Backend Communication
- All database operations handled through API routes/endpoints
- Use TanStack Query for server state management and caching
- Implement proper error handling for API responses
- Use Axios for HTTP requests with interceptors for auth tokens
- Handle loading and error states consistently across the app

### Deployment (Vercel)
- Configure build settings in `vercel.json` if needed
- Use Vercel environment variables for secrets
- Enable automatic deployments from main branch
- Configure custom domains through Vercel dashboard

### Data Management
- All data handling in React should be in custom hooks
- When creating pages, always create atomic components
- Check for existing types/interfaces before creating new ones
- Add strategic logging for key process moments

## Development Notes

- Uses CSS variables for theming with dark mode support
- TypeScript strict mode enabled
- Custom CSS variables defined in globals.css for background/foreground colors
- Font variables are configured at the layout level
- Always use `ppm` as package manager
- Run `npx tsc --noEmit` after completing implementation tasks