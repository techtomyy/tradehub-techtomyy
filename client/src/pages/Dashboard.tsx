import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { 
  TrendingUp, 
  Users, 
  Star
} from "lucide-react";
import { 
  DashboardHeader,
  StatsOverview,
  OverviewTab,
  ListingsTab,
  TransactionsTab
} from "@/components/dashboard";
import { DashboardStats, UserListing, Transaction } from "@/types/dashboard";

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
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value={TAB_VALUES.OVERVIEW}>Overview</TabsTrigger>
            <TabsTrigger value={TAB_VALUES.LISTINGS}>My Listings</TabsTrigger>
            <TabsTrigger value={TAB_VALUES.TRANSACTIONS}>Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value={TAB_VALUES.OVERVIEW} className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value={TAB_VALUES.LISTINGS} className="space-y-6">
            <ListingsTab 
              userListings={USER_LISTINGS}
              getStatusColor={getStatusColor}
              getCategoryIcon={getCategoryIcon}
            />
          </TabsContent>
          
          <TabsContent value={TAB_VALUES.TRANSACTIONS} className="space-y-6">
            <TransactionsTab userTransactions={USER_TRANSACTIONS} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
