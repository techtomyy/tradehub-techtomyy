import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Star } from "lucide-react";
import { DashboardStats } from "@/types/dashboard";
import { Currency } from "@/lib/store/walletStore";

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
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      label: "Active Listings",
      value: stats.activeListings.toString(),
      showCurrency: false
    },
    {
      icon: Users,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      label: "Active Transactions",
      value: stats.activeTransactions.toString(),
      showCurrency: false
    },
    {
      icon: Wallet,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      label: "Wallet Balance",
      value: formatAmount(convertAmount(stats.walletBalance, 'USD', selectedCurrency), selectedCurrency),
      showCurrency: true,
      currency: selectedCurrency
    },
    {
      icon: Star,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      label: "Total Sales",
      value: stats.totalSales.toString(),
      showCurrency: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-2 ${item.iconBg} rounded-lg`}>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
