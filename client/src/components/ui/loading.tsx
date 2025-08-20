import { Loader2 } from "lucide-react";

// App-level loading component
export function AppLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">TradeHub</h2>
        <p className="text-gray-600">Loading your marketplace...</p>
      </div>
    </div>
  );
}

// Page-level loading component
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading page...</p>
      </div>
    </div>
  );
}

// Error state loader for failed lazy loads
export function ErrorLoader({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load</h2>
        <p className="text-gray-600 mb-4">Something went wrong while loading this component.</p>
        {error && (
          <details className="text-sm text-gray-500 mb-4">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 text-left bg-gray-100 p-2 rounded text-xs overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        {retry && (
          <button
            onClick={retry}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

// Navigation loading component
export function NavigationLoader() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </nav>
  );
}

// Dashboard tab loading component
export function DashboardTabLoader() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Home section loading component
export function HomeSectionLoader() {
  return (
    <div className="space-y-8">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-lg p-8">
        <div className="h-8 w-64 bg-white/20 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-96 bg-white/20 rounded animate-pulse mb-6"></div>
        <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
      </div>
      
      {/* Featured Listings Skeleton */}
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Listing card loading component
export function ListingCardLoader() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      <div className="p-6">
        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Form loading component
export function FormLoader() {
  return (
    <div className="space-y-6">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

// Debug loader for development
export function DebugLoader({ componentName }: { componentName: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600">Loading {componentName}...</p>
        <p className="text-xs text-gray-400 mt-2">Lazy loading in progress</p>
      </div>
    </div>
  );
}
