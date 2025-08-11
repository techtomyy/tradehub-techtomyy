// Public Routes
export const PUBLIC_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  AUTH_CALLBACK: "/auth/callback",
} as const;

// Protected Routes
export const PROTECTED_ROUTES = {
  HOME_PAGE: "/home",
  DASHBOARD: "/dashboard",
  MARKETPLACE: "/marketplace",
  CREATE_LISTING: "/create-listing",
  LISTING_DETAIL: "/listing/:id",
  INBOX: "/inbox",
  MESSAGE: "/message/:id",
  DISPUTE: "/dispute",
  WALLET: "/wallet",
  SETTINGS: "/settings",
} as const;

// Route Groups
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
} as const;

// Navigation Links
export const NAVIGATION_LINKS = {
  HOME: "/",
  HOW_IT_WORKS: "/how-it-works",
  FEATURES: "/features",
  MARKETPLACE: "/marketplace",
} as const;
