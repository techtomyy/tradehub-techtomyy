/**
 * Application Route Constants
 * 
 * This file contains all the route definitions for the application.
 * Routes are organized into public (accessible to all users) and 
 * protected (require authentication) categories.
 */

/**
 * Public Routes
 * 
 * These routes are accessible to all users, including unauthenticated ones.
 * They typically include landing pages, authentication forms, and public information.
 */
export const PUBLIC_ROUTES = {
  /** Landing page - Main entry point for the application */
  HOME: "/",
  /** User login page */
  LOGIN: "/login",
  /** User registration page */
  SIGNUP: "/signup",
  /** OAuth callback endpoint for authentication providers */
  AUTH_CALLBACK: "/auth/callback",
} as const;

/**
 * Protected Routes
 * 
 * These routes require user authentication to access.
 * They contain the main application functionality and user-specific content.
 */
export const PROTECTED_ROUTES = {
  /** Authenticated user's home page */
  HOME_PAGE: "/home",
  /** User dashboard with overview and statistics */
  DASHBOARD: "/dashboard",
  /** Marketplace for browsing and purchasing assets */
  MARKETPLACE: "/marketplace",
  /** Form for creating new asset listings */
  CREATE_LISTING: "/create-listing",
  /** Detailed view of a specific asset listing */
  LISTING_DETAIL: "/listing/:id",
  /** User's message inbox */
  INBOX: "/inbox",
  /** Individual message conversation view */
  MESSAGE: "/message/:id",
  /** Dispute resolution page */
  DISPUTE: "/dispute",
  /** User's wallet and financial management */
  WALLET: "/wallet",
  /** User account settings and preferences */
  SETTINGS: "/settings",
} as const;

/**
 * Combined Routes
 * 
 * Merges all public and protected routes into a single object
 * for convenience when you need access to all routes.
 */
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
} as const;

/**
 * Navigation Links
 * 
 * Links used in the main navigation components.
 * These are typically public-facing links that appear in headers and footers.
 */
export const NAVIGATION_LINKS = {
  /** Home page link */
  HOME: "/",
  /** How it works page - explains the platform */
  HOW_IT_WORKS: "/how-it-works",
  /** Features page - showcases platform capabilities */
  FEATURES: "/features",
  /** Marketplace link - for browsing assets */
  MARKETPLACE: "/marketplace",
} as const;
