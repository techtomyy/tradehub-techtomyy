import { create } from "zustand";

interface Message {
  id: number;
  name: string;
  verified: boolean;
  platform: string;
  price: number;
  read: boolean;
}

interface InboxStore {
  messages: Message[];
  unreadCount: number;
  markAsRead: (id: number) => void;
}

export const useInboxStore = create<InboxStore>((set, get) => ({
  messages: [
    { id: 1, name: "Seller Name", verified: true, platform: "YouTube Channel", price: 2500, read: false },
    { id: 2, name: "Instagram Seller", verified: false, platform: "Instagram handle", price: 1500, read: false },
  ],
  get unreadCount() {
    return get().messages.filter((msg) => !msg.read).length;
  },
  markAsRead: (id) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, read: true } : msg
      ),
    })),
}));
