import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/types/navigation";

interface NotificationsDropdownProps {
  notifications: Notification[];
}

/**
 * Notifications Dropdown Component
 * 
 * Dropdown menu displaying user notifications with timestamps
 * and a link to view all notifications.
 */
export function NotificationsDropdown({ notifications }: NotificationsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover-golden">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="flex flex-col items-start py-2 cursor-pointer hover-golden"
          >
            <span className="text-sm">{notification.text}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(notification.time, { addSuffix: true })}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary hover-golden">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
