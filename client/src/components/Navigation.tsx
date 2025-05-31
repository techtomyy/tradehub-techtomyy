import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Bell, User, Wallet, Settings, LogOut, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-gray-900">AssetVault</span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link href="/marketplace">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Marketplace
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sell Asset
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            {dashboardStats && (
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Wallet className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">${dashboardStats.walletBalance}</span>
              </div>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {/* Notification badge - would be dynamic based on actual notifications */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={user.profileImageUrl} 
                      alt={user.firstName || user.email || 'User'} 
                    />
                    <AvatarFallback>
                      {user.firstName?.[0] || user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    {user.kycVerified && (
                      <Badge variant="outline" className="w-fit">
                        <Shield className="h-3 w-3 mr-1" />
                        KYC Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full">
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallet</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
