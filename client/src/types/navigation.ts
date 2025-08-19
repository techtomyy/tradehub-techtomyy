import { Currency } from "@/lib/store/walletStore";

export interface Notification {
  id: number;
  text: string;
  time: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  kycVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
