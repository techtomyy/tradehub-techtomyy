import { Currency } from "@/lib/store/walletStore";

export interface Notification {
  id: number;
  text: string;
  time: Date;
}

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImageUrl?: string;
  kycVerified?: boolean;
}
