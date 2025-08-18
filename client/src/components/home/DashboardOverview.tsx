import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Star } from "lucide-react";
import { Currency } from "@/lib/store/walletStore";

interface DashboardOverviewProps {
  dashboardStats: {
    activeListings: number;
    activeTransactions: number;
    totalSales: number;
  };
  walletBalance: number;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
}

/**
 * Dashboard Overview Component
 * 
 * Displays a grid of key dashboard statistics including active listings,
 * transactions, wallet balance, and total sales.
 */
export function DashboardOverview({ 
  dashboardStats, 
  walletBalance, 
  selectedCurrency, 
  formatAmount, 
  convertAmount 
}: DashboardOverviewProps) {
  const statItems = [
    {
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      label: "Active Listings",
      value: dashboardStats.activeListings.toString(),
      showCurrency: false
    },
    {
      icon: Users,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      label: "Active Transactions",
      value: dashboardStats.activeTransactions.toString(),
      showCurrency: false
    },
    {
      icon: Wallet,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      label: "Wallet Balance",
      value: formatAmount(convertAmount(walletBalance, 'USD', selectedCurrency), selectedCurrency),
      showCurrency: true,
      currency: selectedCurrency
    },
    {
      icon: Star,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      label: "Total Sales",
      value: dashboardStats.totalSales.toString(),
      showCurrency: false
    }
  ];

  return (
    <section className="py-8 sm:py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-7 md:mb-8">
          {statItems.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-center">
                  <div className={`p-2 ${item.iconBg} rounded-lg`}>
                    <item.icon className={`h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 ${item.iconColor}`} />
                  </div>
                  <div className="ml-3 sm:ml-3 md:ml-4">
                    <p className="text-xs sm:text-sm md:text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{item.value}</p>
                    {item.showCurrency && (
                      <p className="text-xs text-gray-500">{item.currency}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
