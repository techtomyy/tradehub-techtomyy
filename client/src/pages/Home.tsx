import { Suspense, lazy } from "react";
import Navigation from "@/components/Navigation";
import { useWalletStore } from "@/lib/store/walletStore";
import { useInboxStore } from "@/lib/store/inboxStore";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { HomeSectionLoader } from "@/components/ui/loading";
import { 
  HeroSection,
  DashboardOverview,
  RecentTransactions,
  FloatingInboxButton
} from "@/components/home";
import { FeaturedListing, DashboardStats, Transaction } from "@/types/home";

// Lazy load the FeaturedListings component
const FeaturedListings = lazy(() => 
  import("@/components/home/FeaturedListings").then(module => ({ 
    default: module.FeaturedListings 
  }))
);

export default function Home() {
  const walletBalance = useWalletStore((state) => state.balance);
  const unreadMessages = useInboxStore((state) => state.unreadCount);
  const { selectedCurrency, formatAmount, convertAmount } = useCurrency();

  // Static featured listings data with currency conversion
  const featuredListings: FeaturedListing[] = [
    {
      id: 1,
      title: "Travel Photography Instagram",
      price: selectedCurrency === 'PKR' ? (2500 * 280).toString() : "2500",
      category: "instagram",
      followers: 15000,
      engagement: 4.2,
      verified: true,
      featured: true,
    },
    {
      id: 2,
      title: "Gaming YouTube Channel",
      price: selectedCurrency === 'PKR' ? (5000 * 280).toString() : "5000",
      category: "youtube",
      followers: 25000,
      engagement: 3.8,
      verified: true,
      featured: true,
    },
    {
      id: 3,
      title: "Fitness TikTok Account",
      price: selectedCurrency === 'PKR' ? (1800 * 280).toString() : "1800",
      category: "tiktok",
      followers: 12000,
      engagement: 5.1,
      verified: false,
      featured: true,
    },
    {
      id: 4,
      title: "Tech News Twitter",
      price: selectedCurrency === 'PKR' ? (3200 * 280).toString() : "3200",
      category: "twitter",
      followers: 18000,
      engagement: 4.7,
      verified: true,
      featured: true,
    },
    {
      id: 5,
      title: "E-commerce Website",
      price: selectedCurrency === 'PKR' ? (8000 * 280).toString() : "8000",
      category: "website",
      followers: 5000,
      engagement: 2.1,
      verified: true,
      featured: true,
    },
    {
      id: 6,
      title: "Food Blog Instagram",
      price: selectedCurrency === 'PKR' ? (1200 * 280).toString() : "1200",
      category: "instagram",
      followers: 8000,
      engagement: 6.2,
      verified: false,
      featured: true,
    },
  ];

  // Static user transactions data
  const userTransactions: Transaction[] = [
    {
      id: "1",
      buyerId: "B001",
      sellerId: "S001",
      listingId: "L001",
      amount: selectedCurrency === 'PKR' ? (2500 * 287).toString() : "2500",
      buyerFee: selectedCurrency === 'PKR' ? (50 * 287).toString() : "50",
      sellerFee: selectedCurrency === 'PKR' ? (75 * 287).toString() : "75",
      totalAmount: selectedCurrency === 'PKR' ? (2625 * 287).toString() : "2625",
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
      amount: selectedCurrency === 'PKR' ? (1800 * 287).toString() : "1800",
      buyerFee: selectedCurrency === 'PKR' ? (40 * 287).toString() : "40",
      sellerFee: selectedCurrency === 'PKR' ? (60 * 287).toString() : "60",
      totalAmount: selectedCurrency === 'PKR' ? (1900 * 287).toString() : "1900",
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
      amount: selectedCurrency === 'PKR' ? (5000 * 287).toString() : "5000",
      buyerFee: selectedCurrency === 'PKR' ? (100 * 287).toString() : "100",
      sellerFee: selectedCurrency === 'PKR' ? (150 * 287).toString() : "150",
      totalAmount: selectedCurrency === 'PKR' ? (5250 * 287).toString() : "5250",
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

  // Static dashboard stats
  const dashboardStats: DashboardStats = {
    activeListings: 3,
    activeTransactions: 2,
    totalSales: 5,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Dashboard Overview */}
      <DashboardOverview 
        dashboardStats={dashboardStats}
        walletBalance={walletBalance}
        selectedCurrency={selectedCurrency}
        formatAmount={formatAmount}
        convertAmount={convertAmount}
      />

      {/* Featured Listings */}
      <Suspense fallback={<HomeSectionLoader />}>
        <FeaturedListings featuredListings={featuredListings} />
      </Suspense>

      {/* Recent Transactions */}
      <RecentTransactions userTransactions={userTransactions} />

      {/* Floating Inbox Button */}
      <FloatingInboxButton unreadMessages={unreadMessages} />
    </div>
  );
}
