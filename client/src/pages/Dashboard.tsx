import { useState } from "react";
import Navigation from "@/components/Navigation";
import TransactionCard from "@/components/TransactionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Star, 
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { selectedCurrency, formatAmount, convertAmount } = useCurrency();

  // Static dashboard data
  const dashboardStats = {
    activeListings: 2,
    activeTransactions: 1,
    walletBalance: 500, // Base amount in USD
    totalSales: 2,
  };

  const userListings = [
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
    // ...more
  ];

// Example static user transactions
const userTransactions = [
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


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'payment_received': case 'credentials_sent': case 'verified': 
        return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Manage your listings, transactions, and account</p>
          </div>
          <Link href="/create-listing">
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              List Asset
            </Button>
          </Link>
        </div>
        {/* Stats Overview */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                      {formatAmount(convertAmount(dashboardStats.walletBalance, 'USD', selectedCurrency), selectedCurrency)}
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
        )}
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Transactions
                    <Link href="#" onClick={() => setActiveTab("transactions")}> 
                      <Button variant="ghost" size="sm">
                        View All <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userTransactions?.slice(0, 3).map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatAmount(convertAmount(parseFloat(transaction.amount), 'USD', selectedCurrency), selectedCurrency)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getTransactionStatusColor(transaction.status)}>
                          {transaction.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                    {(!userTransactions || userTransactions.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No transactions yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* Recent Listings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Listings
                    <Link href="#" onClick={() => setActiveTab("listings")}> 
                      <Button variant="ghost" size="sm">
                        View All <ArrowUpRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userListings?.slice(0, 3).map((listing: any) => (
                      <div key={listing.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">
                              {listing.category === 'instagram' ? '📷' : 
                               listing.category === 'youtube' ? '📹' : 
                               listing.category === 'tiktok' ? '🎵' : 
                               listing.category === 'twitter' ? '🐦' : '🌐'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                            <p className="text-xs text-gray-500">${listing.price}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status}
                        </Badge>
                      </div>
                    ))}
                    {(!userListings || userListings.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No listings yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="listings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
              <Link href="/create-listing">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Listing
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings?.map((listing: any) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {listing.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${parseFloat(listing.price.toString()).toLocaleString()}
                      </span>
                      <Link href={`/listing/${listing.id}`}>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!userListings || userListings.length === 0) && (
                <div className="col-span-full text-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first listing</p>
                  <Link href="/create-listing">
                    <Button>Create Your First Listing</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
            <div className="space-y-4">
              {userTransactions?.map((transaction: any) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
              {(!userTransactions || userTransactions.length === 0) && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-600 mb-6">Start buying or selling assets to see your transaction history</p>
                  <Link href="/marketplace">
                    <Button>Browse Marketplace</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
