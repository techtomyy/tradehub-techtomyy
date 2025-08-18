import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { useWalletStore } from "@/lib/store/walletStore";
import { NavigationLeft } from "./navigation/NavigationLeft";
import { NavigationRight } from "./navigation/NavigationRight";
import { MobileNavigation } from "./navigation/MobileNavigation";
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

  // Map user data from useAuth to User interface expected by navigation components
  const mapUserToNavigationUser = (authUser: any): User => {
    // Extract first and last names from various possible sources
    let firstName = authUser.firstName || 
                   authUser.user_metadata?.firstName || 
                   authUser.user_metadata?.full_name?.split(' ')[0] ||
                   authUser.email?.split('@')[0];
    
    let lastName = authUser.lastName || 
                  authUser.user_metadata?.lastName || 
                  authUser.user_metadata?.full_name?.split(' ')[1] ||
                  '';
    
    // Clean up the names (remove undefined/null values)
    firstName = firstName || '';
    lastName = lastName || '';
    
    return {
      firstName: firstName,
      lastName: lastName,
      email: authUser.email,
      profileImageUrl: authUser.profileImageUrl,
      kycVerified: authUser.kycVerified,
    };
  };

  const navigationUser = mapUserToNavigationUser(user);

  // Debug logging
  console.log('Navigation - Original user from useAuth:', user);
  console.log('Navigation - Mapped navigation user:', navigationUser);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Navigation */}
          <NavigationLeft user={navigationUser} />
          
          {/* Right Side */}
          <NavigationRight 
            user={navigationUser}
            walletBalance={walletBalance}
            selectedCurrency={selectedCurrency}
            formatAmount={formatAmount}
            convertAmount={convertAmount}
            setCurrency={setCurrency}
            notifications={notifications}
            logout={logout}
            showMobileMenu={true}
          />
        </div>
      </div>
    </nav>
  );
}
