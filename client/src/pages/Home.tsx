import Navigation from "@/components/Navigation";
import ListingCard from "@/components/ListingCard";
import TransactionCard from "@/components/TransactionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Star, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  // Static featured listings data
  const featuredListings = [
    {
      id: 1,
      title: "Travel Photography Instagram",
      price: 2500,
      category: "instagram",
      followers: 15000,
      engagement: 4.2,
      verified: true,
      featured: true,
    },
    {
      id: 2,
      title: "Gaming YouTube Channel",
      price: 5000,
      category: "youtube",
      followers: 25000,
      engagement: 3.8,
      verified: true,
      featured: true,
    },
    {
      id: 3,
      title: "Fitness TikTok Account",
      price: 1800,
      category: "tiktok",
      followers: 12000,
      engagement: 5.1,
      verified: false,
      featured: true,
    },
    {
      id: 4,
      title: "Tech News Twitter",
      price: 3200,
      category: "twitter",
      followers: 18000,
      engagement: 4.7,
      verified: true,
      featured: true,
    },
    {
      id: 5,
      title: "E-commerce Website",
      price: 8000,
      category: "website",
      followers: 5000,
      engagement: 2.1,
      verified: true,
      featured: true,
    },
    {
      id: 6,
      title: "Food Blog Instagram",
      price: 1200,
      category: "instagram",
      followers: 8000,
      engagement: 6.2,
      verified: false,
      featured: true,
    },
  ];

  // Static user transactions data
  const userTransactions = [
    {
      id: 1,
      type: "purchase",
      amount: 2500,
      status: "completed",
      assetTitle: "Travel Photography Instagram",
      createdAt: new Date("2024-03-15").toISOString(),
    },
    {
      id: 2,
      type: "sale",
      amount: 1800,
      status: "payment_received",
      assetTitle: "Fitness TikTok Account",
      createdAt: new Date("2024-03-10").toISOString(),
    },
    {
      id: 3,
      type: "purchase",
      amount: 5000,
      status: "credentials_sent",
      assetTitle: "Gaming YouTube Channel",
      createdAt: new Date("2024-03-05").toISOString(),
    },
  ];

  // Static dashboard stats
  const dashboardStats = {
    activeListings: 3,
    activeTransactions: 2,
    walletBalance: "1250.00",
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
                    <p className="text-2xl font-bold text-gray-900">${dashboardStats.walletBalance}</p>
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
        className="fixed z-50 bottom-8 right-8 bg-primary text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
        title="Inbox"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
      >
        <Link href="/inbox">
        
        <MessageSquare className="h-7 w-7" />
        <span className="sr-only">Inbox</span>
        </Link>
      </div>
    </div>
  );
}
