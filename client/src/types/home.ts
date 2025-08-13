export interface FeaturedListing {
  id: number;
  title: string;
  price: string;
  category: string;
  followers: number;
  engagement: number;
  verified: boolean;
  featured: boolean;
}

export interface DashboardStats {
  activeListings: number;
  activeTransactions: number;
  totalSales: number;
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
