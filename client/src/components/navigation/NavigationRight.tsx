import { useState } from "react";
import { User, Notification } from "@/types/navigation";
import { Currency } from "@/lib/store/walletStore";
import { CurrencySelector } from "./CurrencySelector";
import { WalletBalance } from "./WalletBalance";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { UserMenu } from "./UserMenu";
import { Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link } from "wouter";

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
  logout 
}: NavigationRightProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex items-center space-x-2 xl:space-x-4">
      {/* Hamburger Button - Visible before 1024px viewport */}
      <div className="block lg:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Navigation Menu - Appears when hamburger is clicked */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b">
              <Link href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold text-gray-900">AssetVault</span>
                </div>
              </Link>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {[
                  { href: "/marketplace", label: "Marketplace" },
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/create-listing", label: "Sell Asset" },
                  { href: "/escrow-management", label: "Escrow Management" }
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left h-12 px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Currency Selector */}
            <div className="p-4 border-t border-gray-200">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Currency</p>
                <CurrencySelector 
                  selectedCurrency={selectedCurrency}
                  setCurrency={setCurrency}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.firstName || user.lastName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email || "user@example.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Currency Selector - Hidden before 1024px viewport */}
      <div className="hidden lg:block">
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
