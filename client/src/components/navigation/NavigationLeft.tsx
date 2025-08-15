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
 * of the navigation bar.
 */
export function NavigationLeft({ user }: NavigationLeftProps) {
  const NAVIGATION_ITEMS = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/create-listing", label: "Sell Asset" },
    { href: "/escrow-management", label: "Escrow Management" }
  ] as const;

  return (
    <div className="flex items-center space-x-8">
      {/* Logo */}
      <Link href="/home">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-gray-900">AssetVault</span>
        </div>
      </Link>

      {/* Main Navigation */}
      <div className="hidden md:flex space-x-6">
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
