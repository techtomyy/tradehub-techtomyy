import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Star } from "lucide-react";
import { DashboardStats } from "@/types/dashboard";
import { Currency } from "@/lib/store/walletStore";
import { motion } from "framer-motion";

interface StatsOverviewProps {
  stats: DashboardStats;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
}

/**
 * Stats Overview Component
 * 
 * Displays a grid of key dashboard statistics including active listings,
 * transactions, wallet balance, and total sales.
 */
export function StatsOverview({ 
  stats, 
  selectedCurrency, 
  formatAmount, 
  convertAmount 
}: StatsOverviewProps) {
  const statItems = [
    {
      icon: TrendingUp,
      iconBg: "bg-gradient-to-r from-blue-500 to-indigo-600",
      iconColor: "text-white",
      label: "Active Listings",
      value: stats.activeListings.toString(),
      showCurrency: false,
      trend: "+12%",
      trendUp: true,
      description: "From last month"
    },
    {
      icon: Users,
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
      iconColor: "text-white",
      label: "Active Transactions",
      value: stats.activeTransactions.toString(),
      showCurrency: false,
      trend: "+8%",
      trendUp: true,
      description: "From last week"
    },
    {
      icon: Wallet,
      iconBg: "bg-gradient-to-r from-amber-500 to-orange-600",
      iconColor: "text-white",
      label: "Wallet Balance",
      value: formatAmount(convertAmount(stats.walletBalance, 'USD', selectedCurrency), selectedCurrency),
      showCurrency: true,
      currency: selectedCurrency,
      trend: "+15%",
      trendUp: true,
      description: "From last month"
    },
    {
      icon: Star,
      iconBg: "bg-gradient-to-r from-blue-500 to-indigo-600",
      iconColor: "text-white",
      label: "Total Sales",
      value: stats.totalSales.toString(),
      showCurrency: false,
      trend: "+8.2%",
      trendUp: true,
      description: "vs last month"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group"
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 ${item.iconBg} rounded-xl shadow-lg`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                    {item.showCurrency && (
                      <p className="text-xs text-gray-500">{item.currency}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600 mb-1">
                    {item.trend}
                  </div>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
