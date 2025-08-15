import { Currency } from "@/lib/store/walletStore";

export interface User {
  id: string;
  name: string;
}

export interface Seller {
  firstName: string;
  lastName: string;
  username: string;
  profileImageUrl: string;
  rating: number;
  totalSales: number;
  kycVerified: boolean;
  bio: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  media: string[];
  verificationStatus: 'verified' | 'unverified';
  followers: number;
  engagement: number;
  monthlyViews: number;
  monthlyRevenue: number;
  status: string;
  sellerId: string;
  seller: Seller;
}

export interface Fees {
  assetPrice: number;
  buyerFee: number;
  totalBuyerPays: number;
  assetPriceInSelectedCurrency: number;
  buyerFeeInSelectedCurrency: number;
  totalBuyerPaysInSelectedCurrency: number;
}
