# Quick Start Guide

## Overview

Your Tickets Management System frontend is ready! Here's what has been created:

### ✅ What's Included

1. **Authentication System**
   - Login page: `/auth/login`
   - Signup page: `/auth/signup`
   - JWT token management
   - Automatic token injection via Axios interceptors

2. **Dashboard (Read-only Observation)**
   - Route: `/`
   - Live WebSocket updates
   - Card-based ticket view
   - Real-time connection status

3. **Tickets Management (CRUD)**
   - Route: `/tickets`
   - Create tickets (dialog form)
   - Edit tickets (inline editing)
   - Delete tickets (with confirmation)
   - Table-based view

4. **Infrastructure**
   - Axios instance with JWT interceptors
   - WebSocket hook with auto-reconnect
   - Type-safe API services
   - Reusable UI components

## 🚀 Running the Application

```bash
# 1. Install dependencies (if not already done)
pnpm install

# 2. Create environment file
cp .env.local.example .env.local

# 3. Edit .env.local with your backend URLs
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3080
# NEXT_PUBLIC_WS_URL=ws://localhost:3083/ws

# 4. Start the dev server
pnpm dev

# 5. Open http://localhost:3000
```

## 📂 Key Files to Know

### API Integration

- `lib/axios.ts` - Axios configuration with JWT interceptor
- `services/api.ts` - All API endpoints (auth + tickets)
- `lib/constants.ts` - API URLs and configuration

### Components

- `hooks/useWebSocket.ts` - WebSocket connection manager
- `types/ticket.ts` - Ticket type definitions
- `types/auth.ts` - Auth type definitions

### Pages

- `app/page.tsx` - Dashboard (observation page)
- `app/tickets/page.tsx` - CRUD operations page
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page

## 🔌 Connecting to Your Backend

### Expected API Endpoints

Your Go backend should implement these endpoints:

**Authentication:**

```
POST /auth/login
Body: { email: string, password: string }
Response: { token: string, user: { id, email, name } }

POST /auth/signup
Body: { email: string, password: string, name: string }
Response: { token: string, user: { id, email, name } }
```

**Tickets:**

```
GET /api/tickets
Headers: Authorization: Bearer <token>
Response: Ticket[]

POST /api/tickets
Headers: Authorization: Bearer <token>
Body: { subject, description, status?, priority? }
Response: Ticket

PUT /api/tickets/:id
Headers: Authorization: Bearer <token>
Body: { subject?, description?, status?, priority? }
Response: Ticket

DELETE /api/tickets/:id
Headers: Authorization: Bearer <token>
Response: 204 No Content
```

**WebSocket:**

```
ws://localhost:3083/ws

Messages:
{
  type: "TICKET_CREATED" | "TICKET_UPDATED" | "TICKET_DELETED",
  data: Ticket | { id: string }
}
```

## 🎨 UI Features

- **Tailwind CSS v4** - Modern styling
- **shadcn/ui components** - Accessible, customizable components
- **Dark mode support** - Built-in theme switching
- **Responsive design** - Mobile-first layouts
- **Lucide icons** - Beautiful icon system

## 🔐 Security Notes

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Automatic token cleanup on 401 responses
- CORS must be enabled on your backend

## 📝 Customization

### Change API URLs

Edit `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
NEXT_PUBLIC_WS_URL=wss://your-ws.com/ws
```

### Modify Ticket Fields

Edit `types/ticket.ts` to add/remove fields

### Add Validation

The forms use basic validation - enhance with Zod schemas

### Customize Colors

Edit `app/globals.css` for theme colors

## 🐛 Troubleshooting

**WebSocket not connecting?**

- Check the WS_URL in `.env.local`
- Ensure backend WebSocket server is running
- Check browser console for connection errors

**API calls failing?**

- Verify API_BASE_URL is correct
- Check network tab for CORS errors
- Ensure backend is running and accessible

**Login not working?**

- Check if token is being stored (inspect localStorage)
- Verify JWT format from backend matches expectations
- Check browser console for errors

## 🎯 Next Steps

1. Start your Go microservices backend
2. Update the environment variables
3. Test the authentication flow
4. Verify CRUD operations
5. Check WebSocket real-time updates
6. Customize the UI to match your needs

## 📚 Documentation

See `README.md` for detailed documentation on:

- Project structure
- Architecture patterns
- API integration
- Component usage
- Type definitions

---

**Happy coding! 🚀**
