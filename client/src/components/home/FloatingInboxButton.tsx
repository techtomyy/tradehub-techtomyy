import { MessageSquare } from "lucide-react";
import { Link } from "wouter";

interface FloatingInboxButtonProps {
  unreadMessages: number;
}

/**
 * Floating Inbox Button Component
 * 
 * Displays a floating inbox button with unread message count
 * positioned at the bottom right of the screen.
 */
export function FloatingInboxButton({ unreadMessages }: FloatingInboxButtonProps) {
  return (
    <div
      className="fixed z-50 bottom-8 right-8"
      title="Inbox"
    >
      <Link href="/inbox">
        <div className="relative bg-primary text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-blue-700 transition-colors">
          <MessageSquare className="h-7 w-7" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              {unreadMessages}
            </span>
          )}
          <span className="sr-only">Inbox</span>
        </div>
      </Link>
    </div>
  );
}
