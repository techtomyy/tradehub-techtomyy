import { User, Notification } from "@/types/navigation";
import { Currency } from "@/lib/store/walletStore";
import { CurrencySelector } from "./CurrencySelector";
import { WalletBalance } from "./WalletBalance";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenu } from "./UserMenu";
import { MobileNavigation } from "./MobileNavigation";

interface NavigationRightProps {
  user: User;
  walletBalance: number;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  setCurrency: (currency: Currency) => void;
  notifications: Notification[];
  logout: () => void;
  showMobileMenu?: boolean;
}

/**
 * Navigation Right Component
 * 
 * Displays the right side of the navigation bar including currency selector,
 * wallet balance, notifications, and user menu. Some elements are hidden
 * on small screens to accommodate the mobile navigation button.
 */
export function NavigationRight({ 
  user, 
  walletBalance, 
  selectedCurrency, 
  formatAmount, 
  convertAmount, 
  setCurrency, 
  notifications, 
  logout,
  showMobileMenu 
}: NavigationRightProps) {
  return (
    <div className="flex items-center space-x-4">
      {/* Mobile Navigation Button - Show on screens smaller than 1072px */}
      {showMobileMenu && (
        <div className="max-[1071px]:block min-[1072px]:hidden">
          <MobileNavigation 
            user={user} 
            selectedCurrency={selectedCurrency}
            setCurrency={setCurrency}
          />
        </div>
      )}

      {/* Currency Selector - Hidden on small screens */}
      <div className="hidden sm:block">
        <CurrencySelector 
          selectedCurrency={selectedCurrency}
          setCurrency={setCurrency}
        />
      </div>

      {/* Wallet Balance - Hidden on small screens */}
      <div className="hidden sm:block">
        <WalletBalance 
          walletBalance={walletBalance}
          selectedCurrency={selectedCurrency}
          formatAmount={formatAmount}
          convertAmount={convertAmount}
        />
      </div>

      {/* Notifications */}
      <NotificationsDropdown notifications={notifications} />

      {/* User Menu */}
      <UserMenu user={user} logout={logout} />
    </div>
  );
}
