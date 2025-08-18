import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, Wallet, Settings, LogOut, Shield } from "lucide-react";
import { Link } from "wouter";
import { User as UserType } from "@/types/navigation";

interface UserMenuProps {
  user: UserType;
  logout: () => void;
}

/**
 * User Menu Component
 * 
 * Dropdown menu for user account management including profile info,
 * navigation links, and logout functionality.
 */
export function UserMenu({ user, logout }: UserMenuProps) {
  const USER_MENU_ITEMS = [
    { href: "/dashboard", icon: User, label: "Dashboard" },
    { href: "/wallet", icon: Wallet, label: "Wallet" },
    { href: "/settings", icon: Settings, label: "Settings" }
  ] as const;

  const getUserInitials = (): string => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user.firstName) {
      return user.firstName[0];
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = (): string => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email;
    }
    return 'User';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-golden">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.profileImageUrl}
              alt={getDisplayName()}
            />
            <AvatarFallback>
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* User Info */}
        <UserInfo user={user} />
        
        <DropdownMenuSeparator />
        
        {/* Menu Items */}
        {USER_MENU_ITEMS.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="hover-golden">
            <Link href={item.href} className="w-full">
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem onClick={logout} className="hover-golden">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * User Info Component
 * 
 * Displays user information in the user menu dropdown
 * including name, email, and verification status.
 */
function UserInfo({ user }: { user: UserType }) {
  return (
    <div className="flex items-center justify-start gap-2 p-2">
      <div className="flex flex-col space-y-1 leading-none">
        <p className="font-medium">
          {user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}`
            : user.firstName || user.email || 'User'
          }
        </p>
        {user.email && (
          <p className="w-[200px] truncate text-sm text-muted-foreground">
            {user.email}
          </p>
        )}
        {user.kycVerified && (
          <Badge variant="outline" className="w-fit">
            <Shield className="h-3 w-3 mr-1" />
            KYC Verified
          </Badge>
        )}
      </div>
    </div>
  );
}
