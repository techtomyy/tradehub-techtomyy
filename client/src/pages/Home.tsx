import Navigation from "@/components/Navigation";
import ListingCard from "@/components/ListingCard";
import TransactionCard from "@/components/TransactionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Star, MessageSquare } from "lucide-react";
import { useWalletStore } from "@/lib/store/walletStore";
import { useInboxStore } from "@/lib/store/inboxStore";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { Link } from "wouter";

export default function Home() {
  const walletBalance = useWalletStore((state) => state.balance);
  const unreadMessages = useInboxStore((state) => state.unreadCount);
  const { selectedCurrency, formatAmount, convertAmount } = useCurrency();

  // Static featured listings data with currency conversion
  const featuredListings = [
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
  // Example static user transactions
const userTransactions = [
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
  const dashboardStats = {
    activeListings: 3,
    activeTransactions: 2,
    totalSales: 5,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Buy & Sell Digital Assets
                <span className="text-blue-200 block">Securely</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                The trusted marketplace for Instagram pages, YouTube channels, TikTok accounts, and more.
                Protected by our escrow system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/marketplace">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
                    Browse Marketplace
                  </Button>
                </Link>
                <Link href="/create-listing">
                  <Button size="lg" variant="outline" className="border-white text-primary hover:bg-gray-50">
                    List Your Asset
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4">Platform Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">$2.5M+</div>
                    <div className="text-blue-200 text-sm">Total Volume</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">15K+</div>
                    <div className="text-blue-200 text-sm">Assets Sold</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">99.8%</div>
                    <div className="text-blue-200 text-sm">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">5K+</div>
                    <div className="text-blue-200 text-sm">Active Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeListings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeTransactions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Wallet className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatAmount(convertAmount(walletBalance, 'USD', selectedCurrency), selectedCurrency)}
                    </p>
                    <p className="text-xs text-gray-500">{selectedCurrency}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalSales}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link href="/marketplace">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.slice(0, 6).map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Recent Transactions</h2>
            <Link href="/dashboard">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {userTransactions.slice(0, 3).map((transaction: any) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </section>

      {/* Floating Inbox Button */}
      <div
        className="fixed z-50 bottom-8 right-8"
        title="Inbox"
      >
        <Link href="/inbox">
          <div className="relative bg-primary text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-blue-700 transition-colors">
            <MessageSquare className="h-7 w-7" />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {unreadMessages}
              </span>
            )}
            <span className="sr-only">Inbox</span>
          </div>
        </Link>
      </div>

    </div>
  );
}
