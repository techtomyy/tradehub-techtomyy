# Routes Structure

This folder contains all the routing logic for the AssetVault application.

## File Structure

```
routes/
├── index.tsx          # Main routes configuration
├── constants.ts       # Route path constants
└── README.md         # This documentation
```

## Route Types

### Public Routes
Routes that are accessible without authentication:
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/auth/callback` - OAuth callback handler

### Protected Routes
Routes that require authentication:
- `/home` - User home page (authenticated)
- `/dashboard` - User dashboard
- `/marketplace` - Asset marketplace
- `/create-listing` - Create new listing
- `/listing/:id` - View listing details
- `/inbox` - User inbox
- `/message/:id` - View specific message
- `/dispute` - Dispute resolution

## Usage

### In Components
```tsx
import { ROUTES } from "@/routes/constants";

// Use route constants
<Link href={ROUTES.DASHBOARD}>Dashboard</Link>
<Link href={ROUTES.MARKETPLACE}>Marketplace</Link>
```

### Adding New Routes

1. **Add to constants.ts:**
```tsx
export const PROTECTED_ROUTES = {
  // ... existing routes
  NEW_ROUTE: "/new-route",
} as const;
```

2. **Add to index.tsx:**
```tsx
const protectedRoutes = [
  // ... existing routes
  { path: PROTECTED_ROUTES.NEW_ROUTE, component: NewComponent },
];
```

3. **Import the component:**
```tsx
import NewComponent from "@/pages/NewComponent";
```

## Protected Route Logic

The `ProtectedRoute` component:
- Checks if user is authenticated
- Shows loading state while checking
- Redirects to login if not authenticated
- Renders the component if authenticated

## Benefits

- **Centralized**: All routes in one place
- **Type-safe**: Constants prevent typos
- **Maintainable**: Easy to update routes
- **Reusable**: Route constants can be used throughout the app
- **Organized**: Clear separation of public vs protected routes
