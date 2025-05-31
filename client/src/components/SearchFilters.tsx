import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface SearchFiltersProps {
  filters: {
    search: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    minFollowers: string;
    maxFollowers: string;
    verified: boolean;
    sort: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const { user } = useAuth();

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!user,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minFollowers: "",
      maxFollowers: "",
      verified: false,
      sort: "latest",
    });
  };

  const hasActiveFilters = () => {
    return filters.category || filters.minPrice || filters.maxPrice || 
           filters.minFollowers || filters.maxFollowers || filters.verified;
  };

  const priceRanges = [
    { label: "Under $100", min: "", max: "100" },
    { label: "$100 - $500", min: "100", max: "500" },
    { label: "$500 - $1,000", min: "500", max: "1000" },
    { label: "$1,000 - $5,000", min: "1000", max: "5000" },
    { label: "$5,000 - $10,000", min: "5000", max: "10000" },
    { label: "Over $10,000", min: "10000", max: "" },
  ];

  const followerRanges = [
    { label: "1K - 10K", min: "1000", max: "10000" },
    { label: "10K - 50K", min: "10000", max: "50000" },
    { label: "50K - 100K", min: "50000", max: "100000" },
    { label: "100K - 500K", min: "100000", max: "500000" },
    { label: "500K - 1M", min: "500000", max: "1000000" },
    { label: "1M+", min: "1000000", max: "" },
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      {dashboardStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-emerald-600" />
              Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available Balance</span>
              <span className="text-lg font-semibold text-gray-900">
                ${dashboardStats.walletBalance}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Escrow</span>
              <span className="text-sm font-medium text-amber-600">
                ${dashboardStats.escrowBalance}
              </span>
            </div>
            <Separator />
            <Button variant="outline" size="sm" className="w-full">
              Add Funds
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            {hasActiveFilters() && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="instagram">📷 Instagram</SelectItem>
                <SelectItem value="youtube">📹 YouTube</SelectItem>
                <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                <SelectItem value="twitter">🐦 Twitter</SelectItem>
                <SelectItem value="website">🌐 Website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Price Range</Label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              {priceRanges.map((range) => (
                <Button
                  key={range.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => {
                    handleInputChange('minPrice', range.min);
                    handleInputChange('maxPrice', range.max);
                  }}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Followers Range */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Followers</Label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minFollowers}
                onChange={(e) => handleInputChange('minFollowers', e.target.value)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxFollowers}
                onChange={(e) => handleInputChange('maxFollowers', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1">
              {followerRanges.map((range) => (
                <Button
                  key={range.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  onClick={() => {
                    handleInputChange('minFollowers', range.min);
                    handleInputChange('maxFollowers', range.max);
                  }}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2">Verification</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={filters.verified}
                  onCheckedChange={(checked) => handleInputChange('verified', checked)}
                />
                <Label htmlFor="verified" className="text-sm text-gray-600">
                  Platform Verified Only
                </Label>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters() && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.category}
                    <button
                      onClick={() => handleInputChange('category', '')}
                      className="ml-1 hover:bg-gray-300 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge variant="secondary" className="text-xs">
                    ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                    <button
                      onClick={() => {
                        handleInputChange('minPrice', '');
                        handleInputChange('maxPrice', '');
                      }}
                      className="ml-1 hover:bg-gray-300 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.minFollowers || filters.maxFollowers) && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.minFollowers || '0'} - {filters.maxFollowers || '∞'} followers
                    <button
                      onClick={() => {
                        handleInputChange('minFollowers', '');
                        handleInputChange('maxFollowers', '');
                      }}
                      className="ml-1 hover:bg-gray-300 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                    <button
                      onClick={() => handleInputChange('verified', false)}
                      className="ml-1 hover:bg-gray-300 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
