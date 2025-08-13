import { Currency } from "@/lib/store/walletStore";

export interface DashboardStats {
  activeListings: number;
  activeTransactions: number;
  walletBalance: number;
  totalSales: number;
}

export interface UserListing {
  id: number;
  title: string;
  price: number;
  category: string;
  status: string;
  description: string;
}

export interface Transaction {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  amount: string;
  buyerFee: string;
  sellerFee: string;
  totalAmount: string;
  status: string;
  verificationDeadline: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
  listing: {
    title: string;
    category: string;
  };
  buyer: {
    firstName: string;
    lastName: string;
  };
  seller: {
    firstName: string;
    lastName: string;
  };
}
