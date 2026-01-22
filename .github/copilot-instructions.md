# Project: Go Microservices Client

This is a Next.js 16 client application designed to interface with a Go microservices backend. The project uses modern React 19, TypeScript, and is styled with Tailwind CSS v4.

## Architecture Overview

- **Framework**: Next.js 16 App Router with React Server Components
- **Styling**: Tailwind CSS v4 with custom design tokens defined in `app/globals.css`
- **UI Components**: Custom component library inspired by shadcn/ui patterns (not directly using shadcn CLI)
- **Package Manager**: pnpm with workspace configuration
- **Type Safety**: Strict TypeScript with path aliases (`@/*` maps to project root)

## Project Structure

```
app/              # Next.js App Router pages and layouts
components/ui/    # Reusable UI component library
lib/utils.ts      # Shared utilities (cn helper for className merging)
```

## Key Conventions

### Component Patterns

All UI components in `components/ui/` follow a consistent pattern:

1. **Data Slot Architecture**: Components use `data-slot` attributes for styling hooks (e.g., `data-slot="card"`, `data-slot="field-label"`)
2. **Compound Components**: Complex components like Card, Field, and Table export multiple sub-components (e.g., `Card`, `CardHeader`, `CardTitle`)
3. **Type Safety**: Components extend native HTML element types using `React.ComponentProps<"div">` pattern
4. **className Merging**: Always use the `cn()` utility from `@/lib/utils` for combining className strings with Tailwind merge support

Example from [components/ui/card.tsx](components/ui/card.tsx):

```tsx
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6...",
        className,
      )}
      {...props}
    />
  );
}
```

### Field Components

The Field component system in [components/ui/field.tsx](components/ui/field.tsx) supports:

- Responsive orientation variants (`vertical`, `horizontal`, `responsive`)
- Container queries via Tailwind's `@container` syntax
- Client-side rendering with `"use client"` directive
- CVA (class-variance-authority) for variant management

### Styling System

Tailwind CSS v4 configuration in [app/globals.css](app/globals.css):

- Custom color tokens defined in `:root` and `.dark` classes using OKLCH color space
- Design system variables prefixed with `--color-`, `--radius-`
- Theme values mapped through `@theme inline` directive
- Custom dark mode variant: `@custom-variant dark (&:is(.dark *))`
- Geist Sans and Geist Mono fonts loaded via Next.js font optimization

### Import Aliases

Configured in [tsconfig.json](tsconfig.json):

- `@/*` → Project root (use `@/components/ui/...`, `@/lib/...`)
- Components config in [components.json](components.json) defines additional aliases:
  - `@/components` → components/
  - `@/lib` → lib/
  - `@/ui` → components/ui/

## Development Workflow

### Available Scripts (from [package.json](package.json))

```bash
pnpm dev        # Start dev server (http://localhost:3000)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm typecheck  # TypeScript type checking without emit
```

### Type Checking

Always run `pnpm typecheck` before committing. Strict mode is enabled with `noEmit: true` for validation without compilation.

### ESLint Configuration

Uses flat config format ([eslint.config.mjs](eslint.config.mjs)) with Next.js core-web-vitals and TypeScript rules. Custom ignore patterns for `.next/`, `out/`, `build/`.

## Microservices Integration

This client is intended to communicate with a Go microservices backend. When implementing API integrations:

1. Backend services are expected to be separate (likely in adjacent repository)
2. Consider using Next.js API routes (`app/api/`) as a BFF (Backend for Frontend) layer
3. Use React Server Components for data fetching where appropriate
4. Form handling: react-hook-form with zod validation (already in dependencies)

## Dependencies

Core libraries:

- **UI Primitives**: Radix UI (dialog, label, separator)
- **Tables**: TanStack Table v8
- **Forms**: react-hook-form + zod
- **Styling**: tailwind-merge, clsx, class-variance-authority
- **Icons**: lucide-react

## Notes

- Project name suggests this is a learning/study project for Go microservices architecture
- UI components are ready for integration but no backend API calls implemented yet
- Dark mode support is built-in via CSS class switching
