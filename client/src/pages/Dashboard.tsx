import { useState, Suspense, lazy } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { DashboardTabLoader } from "@/components/ui/loading";
import { LazyLoadErrorBoundary } from "@/components/ui/LazyLoadErrorBoundary";
import { 
  TrendingUp, 
  Users, 
  Star,
  Plus,
  Award,
  Activity,
  Bell,
  Zap
} from "lucide-react";
import { DashboardHeader, StatsOverview, AnalyticsModal } from "@/components/dashboard";
import { DashboardStats, UserListing, Transaction } from "@/types/dashboard";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Lazy load dashboard tab components using the utility function
const OverviewTab = lazy(() => 
  import("@/components/dashboard/OverviewTab").then(module => ({ 
    default: module.OverviewTab 
  }))
);
const ListingsTab = lazy(() => 
  import("@/components/dashboard/ListingsTab").then(module => ({ 
    default: module.ListingsTab 
  }))
);
const TransactionsTab = lazy(() => 
  import("@/components/dashboard/TransactionsTab").then(module => ({ 
    default: module.TransactionsTab 
  }))
);

// Constants
const TAB_VALUES = {
  OVERVIEW: "overview",
  LISTINGS: "listings",
  TRANSACTIONS: "transactions"
} as const;

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-yellow-100 text-yellow-800',
  sold: 'bg-blue-100 text-blue-800',
  expired: 'bg-gray-100 text-gray-800',
  default: 'bg-gray-100 text-gray-800'
} as const;

const TRANSACTION_STATUS_COLORS = {
  completed: 'bg-emerald-100 text-emerald-800',
  disputed: 'bg-red-100 text-red-800',
  payment_received: 'bg-yellow-100 text-yellow-800',
  credentials_sent: 'bg-yellow-100 text-yellow-800',
  verified: 'bg-yellow-100 text-yellow-800',
  default: 'bg-gray-100 text-gray-800'
} as const;

const CATEGORY_ICONS = {
  instagram: '📷',
  youtube: '📹',
  tiktok: '🎵',
  twitter: '🐦',
  default: '🌐'
} as const;

// Static data
const DASHBOARD_STATS: DashboardStats = {
  activeListings: 2,
  activeTransactions: 1,
  walletBalance: 500, // Base amount in USD
  totalSales: 2,
};

const USER_LISTINGS: UserListing[] = [
  {
    id: 1,
    title: "Demo Asset 1",
    price: 100,
    category: "instagram",
    status: "active",
    description: "A great digital asset.",
  },
  {
    id: 2,
    title: "Demo Asset 2",
    price: 200,
    category: "youtube",
    status: "sold",
    description: "Another awesome asset.",
  },
];

const USER_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    buyerId: "B001",
    sellerId: "S001",
    listingId: "L001",
    amount: "2500",
    buyerFee: "50",
    sellerFee: "75",
    totalAmount: "2625",
    status: "completed",
    verificationDeadline: "2024-03-20T23:59:59.000Z",
    disputeReason: undefined,
    createdAt: "2024-03-15T10:30:00.000Z",
    updatedAt: "2024-03-16T14:45:00.000Z",
    listing: {
      title: "Travel Photography Instagram",
      category: "Social Media",
    },
    buyer: {
      firstName: "John",
      lastName: "Doe",
    },
    seller: {
      firstName: "Alice",
      lastName: "Smith",
    },
  },
  {
    id: "2",
    buyerId: "B002",
    sellerId: "S002",
    listingId: "L002",
    amount: "1800",
    buyerFee: "40",
    sellerFee: "60",
    totalAmount: "1900",
    status: "payment_received",
    verificationDeadline: "2024-03-15T23:59:59.000Z",
    disputeReason: undefined,
    createdAt: "2024-03-10T09:15:00.000Z",
    updatedAt: "2024-03-11T11:25:00.000Z",
    listing: {
      title: "Fitness TikTok Account",
      category: "Social Media",
    },
    buyer: {
      firstName: "Michael",
      lastName: "Brown",
    },
    seller: {
      firstName: "Sophia",
      lastName: "Johnson",
    },
  },
  {
    id: "3",
    buyerId: "B003",
    sellerId: "S003",
    listingId: "L003",
    amount: "5000",
    buyerFee: "100",
    sellerFee: "150",
    totalAmount: "5250",
    status: "credentials_sent",
    verificationDeadline: "2024-03-12T23:59:59.000Z",
    disputeReason: "Credentials not matching description",
    createdAt: "2024-03-05T14:00:00.000Z",
    updatedAt: "2024-03-06T16:40:00.000Z",
    listing: {
      title: "Gaming YouTube Channel",
      category: "Gaming",
    },
    buyer: {
      firstName: "David",
      lastName: "Wilson",
    },
    seller: {
      firstName: "Emma",
      lastName: "Davis",
    },
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>(TAB_VALUES.OVERVIEW);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [notifications] = useState([
    { id: 1, message: "New transaction completed!", type: "success", time: "2 min ago" },
    { id: 2, message: "Your listing has been viewed 15 times", type: "info", time: "1 hour ago" },
    { id: 3, message: "Payment received for Asset #2", type: "success", time: "3 hours ago" }
  ]);
  const { selectedCurrency, formatAmount, convertAmount } = useCurrency();

  // Utility functions
  const getStatusColor = (status: string): string => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
  };

  const getTransactionStatusColor = (status: string): string => {
    return TRANSACTION_STATUS_COLORS[status as keyof typeof TRANSACTION_STATUS_COLORS] || TRANSACTION_STATUS_COLORS.default;
  };

  const getCategoryIcon = (category: string): string => {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.default;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardHeader />
        
        {/* Stats Overview */}
        <StatsOverview stats={DASHBOARD_STATS} selectedCurrency={selectedCurrency} formatAmount={formatAmount} convertAmount={convertAmount} />
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Plus, label: "List Asset", color: "from-blue-500 to-purple-600", onClick: () => setLocation("/create-listing") },
                { icon: Activity, label: "View Analytics", color: "from-green-500 to-emerald-600", onClick: () => setShowAnalytics(true) },
                { icon: Award, label: "Earn Rewards", color: "from-amber-500 to-orange-600", onClick: () => toast({ title: "Coming Soon!", description: "Rewards system will be available soon.", variant: "default" }) },
                { icon: Bell, label: "Notifications", color: "from-pink-500 to-rose-600", onClick: () => setShowNotifications(!showNotifications) }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 text-center cursor-pointer`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <action.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Recent Notifications
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-50 border border-green-200' :
                        notification.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'info' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-sm text-gray-700">{notification.message}</span>
                      </div>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          {/* Enhanced Main Content */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger 
                  value={TAB_VALUES.OVERVIEW}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value={TAB_VALUES.LISTINGS}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  My Listings
                </TabsTrigger>
                <TabsTrigger 
                  value={TAB_VALUES.TRANSACTIONS}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  Transactions
                </TabsTrigger>
          </TabsList>
            </div>
          
          <TabsContent value={TAB_VALUES.OVERVIEW} className="space-y-6">
            <LazyLoadErrorBoundary>
              <Suspense fallback={<DashboardTabLoader />}>
                <OverviewTab 
                  userTransactions={USER_TRANSACTIONS}
                  userListings={USER_LISTINGS}
                  selectedCurrency={selectedCurrency}
                  formatAmount={formatAmount}
                  convertAmount={convertAmount}
                  getTransactionStatusColor={getTransactionStatusColor}
                  getStatusColor={getStatusColor}
                  getCategoryIcon={getCategoryIcon}
                  onTabChange={setActiveTab}
                />
              </Suspense>
            </LazyLoadErrorBoundary>
          </TabsContent>
          
          <TabsContent value={TAB_VALUES.LISTINGS} className="space-y-6">
            <LazyLoadErrorBoundary>
              <Suspense fallback={<DashboardTabLoader />}>
                <ListingsTab 
                  userListings={USER_LISTINGS}
                  getStatusColor={getStatusColor}
                  getCategoryIcon={getCategoryIcon}
                />
              </Suspense>
            </LazyLoadErrorBoundary>
          </TabsContent>
          
          <TabsContent value={TAB_VALUES.TRANSACTIONS} className="space-y-6">
            <LazyLoadErrorBoundary>
              <Suspense fallback={<DashboardTabLoader />}>
                <TransactionsTab userTransactions={USER_TRANSACTIONS} />
              </Suspense>
            </LazyLoadErrorBoundary>
          </TabsContent>
        </Tabs>
        </motion.div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        selectedCurrency={selectedCurrency}
        formatAmount={(amount: number, currency: 'USD' | 'PKR') => formatAmount(amount, currency)}
        convertAmount={convertAmount}
      />
    </div>
  );
}
