export interface UserPayload {
  id?: string;
  name: string;
  email?: string;
  role?: string;
}

export interface Assets {
  title: string;
  category_name: string;
  description: string;
  price: number;
  followers: number;
  engagement_rate: number;
  monthly_view: number;
  monthly_revenue: number;
}
