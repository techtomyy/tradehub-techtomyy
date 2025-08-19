import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Shield } from "lucide-react";
import { Link } from "wouter";
import { User } from "@/types/navigation";
import { CurrencySelector } from "./CurrencySelector";
import { Currency } from "@/lib/store/walletStore";

interface MobileNavigationProps {
  user: User;
  selectedCurrency: Currency;
  setCurrency: (currency: Currency) => void;
}

/**
 * Mobile Navigation Component
 * 
 * Provides a mobile-friendly navigation menu with a hamburger button
 * that opens a slide-out sheet containing navigation links.
 */
export function MobileNavigation({ user, selectedCurrency, setCurrency }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const NAVIGATION_ITEMS = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-listing", label: "Sell Asset" },
    { href: "/escrow-management", label: "Escrow Management" },
  ] as const;

  const handleClose = () => {
    setIsOpen(false);
  };

  // Safe fallbacks for user data
  const userName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || user?.lastName || "User";
  const userEmail = user?.email || "user@example.com";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b">
              <Link href="/home" onClick={handleClose}>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold text-gray-900">AssetVault</span>
                </div>
              </Link>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {NAVIGATION_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} onClick={handleClose}>
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
                    {userInitial}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
