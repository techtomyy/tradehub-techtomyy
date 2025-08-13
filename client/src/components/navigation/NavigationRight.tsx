import { User, Notification } from "@/types/navigation";
import { Currency } from "@/lib/store/walletStore";
import { CurrencySelector } from "./CurrencySelector";
import { WalletBalance } from "./WalletBalance";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenu } from "./UserMenu";

interface NavigationRightProps {
  user: User;
  walletBalance: number;
  selectedCurrency: Currency;
  formatAmount: (amount: number, currency: Currency) => string;
  convertAmount: (amount: number, fromCurrency: Currency, toCurrency: Currency) => number;
  setCurrency: (currency: Currency) => void;
  notifications: Notification[];
  logout: () => void;
}

/**
 * Navigation Right Component
 * 
 * Displays the right side of the navigation bar including currency selector,
 * wallet balance, notifications, and user menu.
 */
export function NavigationRight({ 
  user, 
  walletBalance, 
  selectedCurrency, 
  formatAmount, 
  convertAmount, 
  setCurrency, 
  notifications, 
  logout 
}: NavigationRightProps) {
  return (
    <div className="flex items-center space-x-4">
      {/* Currency Selector */}
      <CurrencySelector 
        selectedCurrency={selectedCurrency}
        setCurrency={setCurrency}
      />

      {/* Wallet Balance */}
      <WalletBalance 
        walletBalance={walletBalance}
        selectedCurrency={selectedCurrency}
        formatAmount={formatAmount}
        convertAmount={convertAmount}
      />

      {/* Notifications */}
      <NotificationsDropdown notifications={notifications} />

      {/* User Menu */}
      <UserMenu user={user} logout={logout} />
    </div>
  );
}
