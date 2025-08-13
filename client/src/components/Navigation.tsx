import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { useWalletStore } from "@/lib/store/walletStore";
import { NavigationLeft } from "./navigation/NavigationLeft";
import { NavigationRight } from "./navigation/NavigationRight";
import { User, Notification } from "@/types/navigation";

// Static data
const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 1, text: "New transaction received", time: new Date(Date.now() - 60 * 60 * 1000) },
  { id: 2, text: "Your withdrawal was approved", time: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: 3, text: "Password changed successfully", time: new Date(Date.now() - 24 * 60 * 60 * 1000) },
];

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const walletBalance = useWalletStore((state) => state.balance);
  const { selectedCurrency, formatAmount, convertAmount, setCurrency } = useCurrency();

  // Static notifications for demo
  const [notifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Navigation */}
          <NavigationLeft user={user} />
          
          {/* Right Side */}
          <NavigationRight 
            user={user}
            walletBalance={walletBalance}
            selectedCurrency={selectedCurrency}
            formatAmount={formatAmount}
            convertAmount={convertAmount}
            setCurrency={setCurrency}
            notifications={notifications}
            logout={logout}
          />
        </div>
      </div>
    </nav>
  );
}
