# Project: Go Microservices Tickets Management Client

This is a Next.js 16 client application for a ticket management system that interfaces with a Go microservices backend. The project implements JWT authentication, real-time WebSocket updates, and full CRUD operations using modern React 19, TypeScript, and Tailwind CSS v4.

## Architecture Overview

- **Framework**: Next.js 16 App Router with **client-side rendering** (`"use client"` directive on all pages)
- **Backend Integration**: Go microservices via REST API + WebSocket for real-time updates
- **Authentication**: JWT token stored in localStorage, auto-attached via Axios interceptors
- **Real-time**: WebSocket connection with auto-reconnect handling for live ticket updates
- **Styling**: Tailwind CSS v4 with OKLCH color tokens in [app/globals.css](app/globals.css)
- **UI Components**: Custom shadcn/ui-inspired library with CVA variants
- **Package Manager**: pnpm

## Critical Integration Points

### API Service Layer Pattern

All backend communication goes through [services/api.ts](services/api.ts):

```typescript
// Two main API namespaces:
authApi.login(payload); // Returns { token, user }
authApi.signup(payload); // Returns { token, user }
ticketsApi.getAll(); // GET /api/tickets
ticketsApi.create(payload); // POST /api/tickets
ticketsApi.update(id, payload); // PUT /api/tickets/:id
ticketsApi.delete(id); // DELETE /api/tickets/:id
```

**Do NOT** call `axiosInstance` directly from pages - always use these service functions.

### Axios Configuration ([lib/axios.ts](lib/axios.ts))

- Request interceptor: Auto-attaches JWT from localStorage as `Authorization: Bearer <token>`
- Response interceptor: On 401, clears token and redirects to `/auth/login`
- Base URL: `NEXT_PUBLIC_API_BASE_URL` env var (default: `http://localhost:3080`)
- **Important**: Only runs on client (`typeof window !== "undefined"` guards)

### WebSocket Integration ([hooks/useWebSocket.ts](hooks/useWebSocket.ts))

Real-time updates pattern used in [app/page.tsx](app/page.tsx) (dashboard):

```typescript
const { isConnected } = useWebSocket({
  onMessage: (message: WebSocketMessage) => {
    switch (message.type) {
      case "TICKET_CREATED":
        setTickets((prev) => [message.data, ...prev]);
        break;
      case "TICKET_UPDATED" /* update ticket in state */:
        break;
      case "TICKET_DELETED" /* remove from state */:
        break;
    }
  },
});
```

- URL: `NEXT_PUBLIC_WS_URL` (default: `ws://localhost:3083/ws`)
- Auto-reconnect: 5 attempts with 3s interval
- Message format: `{ type: string, data: Ticket | { id: string } }`

## Project Structure & Routing

```
app/
  page.tsx                  # Dashboard - read-only observation with WebSocket
  auth/login/page.tsx       # Login page
  auth/signup/page.tsx      # Signup page
  tickets/page.tsx          # CRUD operations page (table + dialogs)
services/api.ts             # API layer - use this for all backend calls
lib/
  axios.ts                  # Axios instance with JWT interceptor
  constants.ts              # API_BASE_URL, WS_URL, StorageKeys enum
types/
  ticket.ts                 # Ticket, WebSocketMessage types
  auth.ts                   # LoginPayload, SignupPayload, AuthResponse
hooks/useWebSocket.ts       # WebSocket with auto-reconnect
components/ui/              # shadcn/ui-inspired components
```

**Page Responsibilities:**

- `/` - Dashboard: Displays tickets in card grid, WebSocket for live updates, read-only
- `/tickets` - CRUD page: Table view with Create/Edit/Delete dialogs, no WebSocket
- `/auth/login` & `/auth/signup` - Auth flows, store token in localStorage

## Key Conventions

### Client-Side Only Architecture

⚠️ **All pages use `"use client"` directive** - no Server Components currently. This is because:

- Auth state managed in localStorage (client-only)
- WebSocket connections require browser APIs
- CRUD operations use React state management

When adding new pages, always add `"use client"` at the top.

### Authentication Flow

1. User logs in via [app/auth/login/page.tsx](app/auth/login/page.tsx)
2. Token stored: `localStorage.setItem(StorageKeys.AUTH_TOKEN, response.token)`
3. Axios interceptor reads token on every request
4. On 401 response, user auto-redirected to login
5. Protected pages check for token in `useEffect`:

```typescript
useEffect(() => {
  const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
  if (!token) {
    router.push("/auth/login");
    return;
  }
  // fetch data...
}, [router]);
```

### Component Patterns

All UI components in [components/ui/](components/ui/) follow shadcn/ui patterns:

1. **CVA Variants**: Use `class-variance-authority` for button/badge variants (see [button.tsx](components/ui/button.tsx))
2. **Compound Components**: Card, Dialog, Table export multiple sub-components
3. **className Merging**: Always use `cn()` from [lib/utils.ts](lib/utils.ts)
4. **Type Safety**: Extend native HTML types: `React.ComponentProps<"button">` + `VariantProps<typeof variants>`

Example creating a new variant component:

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const variants = cva("base-classes", {
  variants: { size: { sm: "...", lg: "..." } },
  defaultVariants: { size: "sm" }
});

interface Props extends React.ComponentProps<"div">, VariantProps<typeof variants> {}

function Component({ className, size, ...props }: Props) {
  return <div className={cn(variants({ size }), className)} {...props} />;
}
```

### Form Handling Pattern

CRUD forms in [app/tickets/page.tsx](app/tickets/page.tsx) use controlled inputs with local state (not react-hook-form):

```typescript
const [formData, setFormData] = useState({ subject: "", description: "", ... });
const [isSubmitting, setIsSubmitting] = useState(false);

const handleCreate = async () => {
  setIsSubmitting(true);
  try {
    const newTicket = await ticketsApi.create(formData);
    setTickets(prev => [...prev, newTicket]);
    setIsCreateDialogOpen(false);
  } catch (err) { /* handle error */ }
  finally { setIsSubmitting(false); }
};
```

**Note**: react-hook-form + zod are installed but not currently used. Future forms should migrate to this pattern.

## Development Workflow

### Available Scripts

```bash
pnpm dev        # Start dev server (http://localhost:3000)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm typecheck  # TypeScript type checking - run before committing
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3080
NEXT_PUBLIC_WS_URL=ws://localhost:3083/ws
```

### Type Definitions

Type files in `types/` define API contracts:

- [types/ticket.ts](types/ticket.ts): `Ticket`, `CreateTicketPayload`, `UpdateTicketPayload`, `WebSocketMessage`
- [types/auth.ts](types/auth.ts): `LoginPayload`, `SignupPayload`, `AuthResponse`

**When backend API changes**, update these types first, then TypeScript will guide necessary UI updates.

## Common Tasks

### Adding a New Protected Page

1. Create page with `"use client"` directive
2. Add auth check in `useEffect`:
   ```typescript
   useEffect(() => {
     if (!localStorage.getItem(StorageKeys.AUTH_TOKEN)) {
       router.push("/auth/login");
     }
   }, [router]);
   ```
3. Use `ticketsApi` or `authApi` from [services/api.ts](services/api.ts)

### Adding a New API Endpoint

1. Define types in `types/`
2. Add method to `ticketsApi` or create new namespace in [services/api.ts](services/api.ts)
3. Use `axiosInstance.get/post/put/delete` - JWT auto-attached

### Styling with Tailwind

- Semantic color tokens: `bg-primary`, `text-card-foreground`, `border-input`
- Custom colors defined in [app/globals.css](app/globals.css) using OKLCH
- Dark mode: Class-based (`.dark` class on `<html>`), not currently implemented in UI
- Fonts: Geist Sans (default) and Geist Mono (code) via Next.js font optimization

## Notes

- This is a **study/learning project** for Go microservices architecture
- Backend is separate (Go microservices not in this repo)
- No server-side rendering currently - all pages are client-rendered
- WebSocket is only enabled on dashboard (`/`), not on CRUD page (`/tickets`)
