import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Link } from "wouter";
import { User } from "@/types/navigation";

interface NavigationLeftProps {
  user: User;
}

/**
 * Navigation Left Component
 * 
 * Displays the logo and main navigation links on the left side
 * of the navigation bar. Navigation items are hidden on small screens
 * where the mobile navigation button is shown instead.
 */
export function NavigationLeft({ user }: NavigationLeftProps) {
  const NAVIGATION_ITEMS = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-listing", label: "Sell Asset" },
    { href: "/escrow-management", label: "Escrow Management" }
  ] as const;

  return (
    <div className="flex items-center space-x-2">
      {/* Logo */}
      <Link href="/home">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-gray-900">AssetVault</span>
        </div>
      </Link>

      {/* Main Navigation - Hidden on screens smaller than 1072px */}
      <div className="hidden min-[1072px]:flex space-x-3 min-[1200px]:space-x-6">
        {NAVIGATION_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className="text-gray-600 hover-golden">
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
