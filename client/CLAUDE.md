# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Setup

This is a Next.js 15 project using React 19 with TypeScript and Tailwind CSS 4. The project is a marketing management platform for online casinos called "Red23". Uses Next.js App Router architecture and is configured to deploy to Vercel.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx tsc --noEmit` - Type check without emitting files (run after completing tasks)

## Architecture

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with PostCSS and tw-animate-css
- **Component Library**: shadcn/ui with Radix UI primitives
- **AI Integration**: Vercel AI SDK (@ai-sdk/openai, @ai-sdk/react)
- **Icons**: Lucide React
- **Theme System**: next-themes with dark mode support
- **Fonts**: Inter from Google Fonts with Geist Mono fallback
- **Path aliases**: `@/*` maps to `./src/*`
- **Styling approach**: CSS Variables with OKLCH color space and custom variants

### Project Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with Inter font and ThemeProvider
  - `page.tsx` - Homepage
  - `globals.css` - Global styles with Tailwind CSS 4 syntax and OKLCH colors
  - `dashboard/page.tsx` - Dashboard page
  - `gallery/page.tsx` - Gallery page
  - `login/page.tsx` - Login page
  - `upload/page.tsx` - Upload page
  - `whatsapp-setup/page.tsx` - WhatsApp setup page
- `src/components/` - Reusable components
  - `ui/` - shadcn/ui components (Button, Card, Input, etc.)
  - `theme-provider.tsx` - Theme context provider
  - `theme-toggle.tsx` - Dark mode toggle component
- `src/lib/utils.ts` - Utility functions (cn helper for class merging)
- `public/` - Static assets including logos and icons

## Frontend Architecture

### Folder Structure

Domain-based organization following these patterns:

```
app/                              # Next.js App Router
├── (auth)/                       # Auth routes group
├── dashboard/                    # Dashboard domain
│   ├── hooks/                   # Domain-specific hooks
│   ├── components/              # Domain components
│   ├── types/                   # Domain types
│   ├── utils/                   # Domain utilities
│   ├── gallery/                 # Sub-domain
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── types/
│   │   └── page.tsx
│   └── page.tsx
├── upload/                      # Upload domain
│   ├── hooks/
│   ├── components/
│   ├── types/
│   └── page.tsx
├── whatsapp-setup/              # WhatsApp setup domain
│   ├── hooks/
│   ├── components/
│   ├── types/
│   └── page.tsx
└── login/                       # Login domain
    ├── components/
    ├── types/
    └── page.tsx

components/                       # Shared components
├── ui/                          # shadcn/ui components
├── auth/                        # Authentication components
├── theme/                       # Theme components
└── shared/                      # Common shared components

lib/                             # Business logic
├── hooks/                       # Global hooks
├── utils/                       # Utilities
└── validations/                 # Zod schemas
```

### Data Fetching

**Use custom hooks for all data fetching:**

```tsx
import { useState, useEffect } from 'react';

// Custom hook example - Always call API routes, never services directly
function useUserProfile(userId: string) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return { data, isLoading, error };
}
```

**Error Handling:**
- Check error types for custom error messages
- Always provide fallback UI for error states
- Use proper HTTP status codes for different error types

**Project includes Vercel AI SDK for AI integrations.** Currently no API routes exist but when implemented, follow the API structure outlined below.

### Component Guidelines

**Atomic Design Principles:**
- **Atoms**: Basic UI elements (Button, Input, Card)
- **Molecules**: Simple component combinations (SearchBox, UserCard)
- **Organisms**: Complex UI sections (Header, Dashboard, Gallery)
- **Templates**: Page layouts
- **Pages**: Specific page implementations

**Component Structure:**
```tsx
// components/domain/specific-component.tsx
interface ComponentProps {
  // Props definition with TypeScript
}

export function ComponentName({ props }: ComponentProps) {
  // Component logic
  return (
    // JSX with proper TypeScript typing
  );
}
```

**Guidelines:**
- Create atomic components that are reusable and focused on single responsibility
- Use TypeScript interfaces for props, preferably with Zod schemas when validation is needed
- Implement proper prop destructuring with default values
- Export components as default exports from their files
- Use shadcn/ui components as base building blocks

### State Management
- All data handling in React must be in custom hooks
- Use React's built-in useState and useReducer for local state
- Theme state is managed by next-themes provider in layout.tsx
- Create custom hooks for complex logic or shared state

### Styling Guidelines
- Use Tailwind CSS 4 with modern syntax and configuration
- Follow mobile-first responsive design approach
- Use CSS variables for theming with OKLCH color space (configured in globals.css)
- Use shadcn/ui components for consistent design system
- Custom color palette includes primary, secondary, tertiary with dark mode variants
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Avoid inline styles unless absolutely necessary

### Authentication & Security
- Handle authentication through backend API endpoints (login, register, logout)
- Store authentication tokens securely (httpOnly cookies or secure localStorage)
- Implement proper route protection with middleware or guards
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
Use react-hook-form with Zod for validation. Use shadcn/ui form components for consistent styling. Show validation errors BELOW the input fields.

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

**Note**: Currently no API routes exist in the project. When implementing, follow the structure above.

### Database Communication
- When database integration is needed, consider the project's requirements
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
- All database operations handled through API routes/endpoints when implemented
- Implement proper error handling for API responses
- Handle loading and error states consistently across the app
- Use Vercel AI SDK for AI-related API integrations

### Deployment (Vercel)
- Project is configured for Vercel deployment
- Use Vercel environment variables for secrets
- Enable automatic deployments from main branch
- Configure custom domains through Vercel dashboard

### Data Management
- All data handling in React should be in custom hooks
- When creating pages, always create atomic components
- Check for existing types/interfaces before creating new ones
- Add strategic logging for key process moments

## Development Notes

- Uses OKLCH color space with CSS variables for theming and dark mode support
- TypeScript strict mode enabled with ES2017 target
- Custom CSS variables defined in globals.css using modern Tailwind CSS 4 syntax
- Inter font configured at the layout level with Geist Mono fallback
- shadcn/ui components configured with neutral base color and CSS variables
- Always use `npm` as package manager
- Run `npx tsc --noEmit` after completing implementation tasks

## Key Dependencies

- **Vercel AI SDK**: For AI integrations (@ai-sdk/openai, @ai-sdk/react, ai)
- **shadcn/ui**: Component library with Radix UI primitives
- **Tailwind CSS 4**: Latest version with modern syntax and OKLCH colors
- **next-themes**: Theme management with system preference detection
- **Zod**: Schema validation for TypeScript
- **Lucide React**: Icon library
- **class-variance-authority & clsx**: For component styling patterns