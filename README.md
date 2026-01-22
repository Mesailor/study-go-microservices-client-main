# Tickets Management System - Frontend

A Next.js 14+ App Router frontend application for managing tickets with real-time WebSocket updates, JWT authentication, and full CRUD operations.

## 🚀 Features

- **Authentication**: JWT-based login and signup with token management
- **Real-time Updates**: WebSocket integration for live ticket updates
- **Dashboard**: Read-only observation page with live data
- **CRUD Operations**: Full ticket management (Create, Read, Update, Delete)
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type Safety**: Fully typed with TypeScript

## 📁 Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   └── signup/page.tsx      # Signup page
│   ├── tickets/page.tsx         # CRUD operations page
│   ├── page.tsx                 # Dashboard (observation page)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/ui/               # UI component library
│   ├── alert-dialog.tsx         # Alert dialog component
│   ├── badge.tsx                # Badge component
│   ├── button.tsx               # Button component
│   ├── card.tsx                 # Card component
│   ├── dialog.tsx               # Dialog component
│   ├── input.tsx                # Input component
│   ├── label.tsx                # Label component
│   ├── separator.tsx            # Separator component
│   ├── table.tsx                # Table component
│   └── textarea.tsx             # Textarea component
├── hooks/
│   └── useWebSocket.ts          # WebSocket custom hook
├── lib/
│   ├── axios.ts                 # Axios instance with interceptors
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Utility functions
├── services/
│   └── api.ts                   # API service layer
└── types/
    ├── auth.ts                  # Auth type definitions
    └── ticket.ts                # Ticket type definitions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui-inspired components
- **HTTP Client**: Axios with interceptors
- **Real-time**: WebSocket
- **Icons**: lucide-react
- **Form Handling**: react-hook-form + zod

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🔧 Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3080
NEXT_PUBLIC_WS_URL=ws://localhost:3083/ws
```

## 📖 Usage

### Authentication

1. Navigate to `/auth/signup` to create a new account
2. Or go to `/auth/login` to sign in with existing credentials
3. JWT token is automatically stored in localStorage and attached to all requests

### Dashboard (Observation Page)

- **Route**: `/`
- **Features**:
  - Read-only view of all tickets
  - Real-time updates via WebSocket
  - Card-based grid layout
  - Status and priority badges
  - Connection status indicator

### Tickets Management

- **Route**: `/tickets`
- **Features**:
  - Create new tickets (button opens dialog)
  - Edit existing tickets (inline edit button)
  - Delete tickets (with confirmation dialog)
  - Table view with all ticket details
  - Status and priority filters

## 🔌 API Integration

### Axios Configuration

The app uses a configured Axios instance with:

- **Base URL**: Configurable via environment variables
- **Request Interceptor**: Automatically attaches JWT token from localStorage
- **Response Interceptor**: Handles 401 errors and redirects to login

### API Endpoints

All API calls are abstracted in `services/api.ts`:

**Auth API**:

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

**Tickets API**:

- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### WebSocket Integration

The `useWebSocket` hook provides:

- Automatic connection management
- Reconnection logic (max 5 attempts)
- Message parsing and handling
- Connection status tracking

**Message Types**:

```typescript
{
  type: "TICKET_CREATED" | "TICKET_UPDATED" | "TICKET_DELETED",
  data: Ticket | { id: string }
}
```

## 🎨 UI Components

All components follow the shadcn/ui pattern with:

- Compound component architecture
- CVA for variant management
- Full TypeScript support
- Tailwind CSS styling
- Accessible by default (Radix UI primitives)

## 🔐 Authentication Flow

1. User submits login/signup form
2. API returns JWT token and user data
3. Token stored in localStorage
4. Axios interceptor attaches token to all requests
5. On 401 response, token is cleared and user redirected to login

## 📊 State Management

- **Local State**: React useState for component-level state
- **Server State**: Direct API calls with Axios
- **Real-time State**: WebSocket updates merged into local state

## 🚦 Error Handling

- Form validation with basic checks (can be enhanced with Zod)
- API error messages displayed in UI
- Network errors caught and displayed
- Authentication errors redirect to login

## 🔄 Real-time Updates

The dashboard automatically updates when:

- New tickets are created (added to top of list)
- Tickets are updated (replaced in-place)
- Tickets are deleted (removed from list)

No page refresh required!

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interactions

## 🎯 Next Steps

To connect to your Go microservices backend:

1. Update the environment variables with your backend URLs
2. Ensure CORS is enabled on your backend
3. Verify the API response formats match the TypeScript types
4. Test WebSocket connection and message formats

## 📝 Type Definitions

All types are defined in the `types/` directory:

- `types/ticket.ts` - Ticket models and WebSocket messages
- `types/auth.ts` - Authentication payloads and responses

## 🤝 Contributing

This is a study project for learning Go microservices architecture. Feel free to use it as a reference or starting point for your own projects.

## 📄 License

MIT
