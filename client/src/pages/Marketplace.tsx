import { useState } from "react";
import Navigation from "@/components/Navigation";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useCurrency } from "@/lib/context/CurrencyContext";

export default function Marketplace() {
  const { selectedCurrency, convertAmount, formatAmount } = useCurrency();
  
  const [filters, setFilters] = useState<{
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    minFollowers: string;
    maxFollowers: string;
    verified: boolean;
    sort: string;
  }>({
    search: "",
    category: "all",
    minPrice: "",
    maxPrice: "",
    minFollowers: "",
    maxFollowers: "",
    verified: false,
    sort: "latest",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 12;

  // Static listings data (prices are stored in USD)
  const staticListings = [
    {
      id: 1,
      title: "Demo Asset 1",
      price: 100, // Price in USD
      category: "instagram",
      followers: 12000,
      createdAt: new Date("2024-01-01").getTime(),
      description: "High-engagement Instagram account with active community",
      media: [],
      verificationStatus: "verified",
      status: "active",
      featured: true,
      sellerId: "seller1",
      seller: {
        rating: "4.8",
        totalSales: 25
      },
      engagement: "5.2",
      monthlyViews: 45000,
      monthlyRevenue: 1200
    },
    {
      id: 2,
      title: "Demo Asset 2",
      price: 200, // Price in USD
      category: "youtube",
      followers: 8000,
      createdAt: new Date("2024-02-01").getTime(),
      description: "Growing YouTube channel with monetization potential",
      media: [],
      verificationStatus: "unverified",
      status: "active",
      featured: false,
      sellerId: "seller2",
      seller: {
        rating: "4.5",
        totalSales: 12
      },
      engagement: "3.8",
      monthlyViews: 28000,
      monthlyRevenue: 800
    },
    // ...add more demo listings
  ];

  // Convert listing prices to selected currency for display
  const getListingPriceInCurrency = (priceInUSD: number) => {
    if (typeof priceInUSD !== 'number' || isNaN(priceInUSD)) {
      return 0;
    }
    return convertAmount(priceInUSD, 'USD', selectedCurrency);
  };

  // Filtering logic with currency conversion
  let filteredListings = staticListings.filter((listing) => {
    if (filters.search && !listing.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.category && filters.category !== "all" && listing.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    
    // Convert filter prices to USD for comparison with listing prices (which are stored in USD)
    const minPriceNum = filters.minPrice ? Number(filters.minPrice) : null;
    const maxPriceNum = filters.maxPrice ? Number(filters.maxPrice) : null;
    
    // Only apply price filters if they are valid numbers
    if (minPriceNum !== null && !isNaN(minPriceNum)) {
      const minPriceUSD = convertAmount(minPriceNum, selectedCurrency, 'USD');
      if (listing.price < minPriceUSD) return false;
    }
    
    if (maxPriceNum !== null && !isNaN(maxPriceNum)) {
      const maxPriceUSD = convertAmount(maxPriceNum, selectedCurrency, 'USD');
      if (listing.price > maxPriceUSD) return false;
    }
    
    if (filters.minFollowers && listing.followers < Number(filters.minFollowers)) return false;
    if (filters.maxFollowers && listing.followers > Number(filters.maxFollowers)) return false;
    if (filters.verified && listing.verificationStatus !== 'verified') return false;
    return true;
  });

  // Sorting logic
  if (filters.sort === "price-low") {
    filteredListings = filteredListings.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price-high") {
    filteredListings = filteredListings.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "followers") {
    filteredListings = filteredListings.sort((a, b) => b.followers - a.followers);
  } else {
    filteredListings = filteredListings.sort((a, b) => b.createdAt - a.createdAt);
  }

  // Pagination logic
  const paginatedListings = filteredListings.slice(currentPage * limit, (currentPage + 1) * limit);
  const isLoading = false;

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(0);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm });
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              selectedCurrency={selectedCurrency}
            />
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search digital assets..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Digital Assets {filteredListings && `(${filteredListings.length} results)`}
              </h2>
              <Select value={filters.sort} onValueChange={(value) => handleFilterChange({ sort: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="followers">Most Followers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'instagram', 'youtube', 'tiktok', 'twitter', 'website'].map((category) => (
                <Button
                  key={category}
                  variant={filters.category === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange({ category })}
                >
                 {category === 'all' ? 'All Categories' : category}
                 
                </Button>
              ))}
            </div>
            {/* Listings Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedListings?.map((listing: any) => (
                  <ListingCard 
                    key={listing.id} 
                    listing={{
                      ...listing,
                      // Convert price to selected currency for display
                      price: getListingPriceInCurrency(listing.price)
                    }} 
                  />
                ))}
                {(!paginatedListings || paginatedListings.length === 0) && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No assets found matching your criteria.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            )}
            {/* Load More */}
            {filteredListings && filteredListings.length > (currentPage + 1) * limit && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Load More Assets
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
