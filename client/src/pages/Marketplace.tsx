import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function Marketplace() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minFollowers: "",
    maxFollowers: "",
    verified: false,
    sort: "latest",
  });

  const [currentPage, setCurrentPage] = useState(0);
  const limit = 12;

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minFollowers) params.append('minFollowers', filters.minFollowers);
    if (filters.maxFollowers) params.append('maxFollowers', filters.maxFollowers);
    if (filters.verified) params.append('verified', 'true');
    
    params.append('limit', limit.toString());
    params.append('offset', (currentPage * limit).toString());
    
    return params.toString();
  };

  const { data: listings, isLoading } = useQuery({
    queryKey: [`/api/listings?${buildQueryParams()}`],
  });

  const handleFilterChange = (newFilters: any) => {
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
            <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
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
                Digital Assets {listings && `(${listings.length} results)`}
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
              {['', 'instagram', 'youtube', 'tiktok', 'twitter', 'website'].map((category) => (
                <Button
                  key={category}
                  variant={filters.category === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange({ category })}
                >
                  {category || 'All Categories'}
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
                {listings?.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
                {(!listings || listings.length === 0) && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No assets found matching your criteria.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            )}

            {/* Load More */}
            {listings && listings.length === limit && (
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
