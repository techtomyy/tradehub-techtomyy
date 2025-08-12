import Navigation from "@/components/Navigation";
import { Link } from "wouter"; // FIX: Use Link from wouter
import { useInboxStore } from "@/lib/store/inboxStore";

export default function Inbox() {
  // Static inbox data
  const inboxMessages = useInboxStore((state) => state.messages);
  const markAsRead = useInboxStore((state) => state.markAsRead);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex items-center justify-center py-16">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md">
          {/* Inbox Title */}
          <div className="border-b px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">Inbox</h1>
          </div>

          {/* Inbox Messages */}
          <div>
            {inboxMessages.map((message, index) => (
              <Link key={message.id} href={`/message/${message.id}`}>
                <a
                  onClick={() => markAsRead(message.id)}
                  className={`flex items-center justify-between px-6 py-4 ${index !== inboxMessages.length - 1 ? "border-b" : ""
                    } hover:bg-gray-50 transition-colors`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Profile Icon (Placeholder) */}
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm text-gray-500">Profile</span>
                    </div>

                    {/* Message Content */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">{message.name}</p>
                        {message.verified && (
                          <span className="text-green-600 text-sm font-medium">✔ Verified</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {message.platform} • ${message.price}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
