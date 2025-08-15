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
import { useCurrency } from "@/lib/context/CurrencyContext";
import { Currency } from "@/lib/store/walletStore";
import { useWalletStore } from "@/lib/store/walletStore";
import { Link } from "wouter";

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
  selectedCurrency: Currency;
}

export default function SearchFilters({ filters, onFilterChange, selectedCurrency }: SearchFiltersProps) {
  const { user } = useAuth();
  const { convertAmount, formatAmount, getCurrencySymbol } = useCurrency();
  
  // Get actual wallet data from the store
  const walletBalance = useWalletStore((state) => state.balance);

  // Convert wallet balance to selected currency
  const getWalletBalanceInCurrency = () => {
    return convertAmount(walletBalance, 'USD', selectedCurrency);
  };

  // Get escrow balance (for demo purposes, using a percentage of wallet balance)
  // In a real app, this would come from the escrow store
  const getEscrowBalanceInCurrency = () => {
    const escrowPercentage = 0.2; // 20% of wallet balance for demo
    const escrowBalanceUSD = walletBalance * escrowPercentage;
    
    return convertAmount(escrowBalanceUSD, 'USD', selectedCurrency);
  };

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

  // Dynamic price ranges based on selected currency
  const getPriceRanges = () => {
    const symbol = getCurrencySymbol(selectedCurrency);
    
    if (selectedCurrency === 'USD') {
      return [
        { label: `Under ${symbol}100`, min: "", max: "100" },
        { label: `${symbol}100 - ${symbol}500`, min: "100", max: "500" },
        { label: `${symbol}500 - ${symbol}1,000`, min: "500", max: "1000" },
        { label: `${symbol}1,000 - ${symbol}5,000`, min: "1000", max: "5000" },
        { label: `${symbol}5,000 - ${symbol}10,000`, min: "5000", max: "10000" },
        { label: `Over ${symbol}10,000`, min: "10000", max: "" },
      ];
    } else {
      // PKR ranges (converted from USD ranges)
      const ranges = [
        { minUSD: 0, maxUSD: 100 },
        { minUSD: 100, maxUSD: 500 },
        { minUSD: 500, maxUSD: 1000 },
        { minUSD: 1000, maxUSD: 5000 },
        { minUSD: 5000, maxUSD: 10000 },
        { minUSD: 10000, maxUSD: null },
      ];
      
      return ranges.map(({ minUSD, maxUSD }) => {
        if (minUSD === 0 && maxUSD !== null) {
          // "Under X" case
          const convertedMax = convertAmount(maxUSD, 'USD', 'PKR');
          const maxPKR = isNaN(convertedMax) ? "0" : Math.round(convertedMax).toString();
          return { label: `Under ${symbol}${maxPKR}`, min: "", max: maxPKR };
        } else if (maxUSD === null) {
          // "Over X" case
          const convertedMin = convertAmount(minUSD, 'USD', 'PKR');
          const minPKR = isNaN(convertedMin) ? "0" : Math.round(convertedMin).toString();
          return { label: `Over ${symbol}${minPKR}`, min: minPKR, max: "" };
        } else {
          // "X - Y" case
          const convertedMin = convertAmount(minUSD, 'USD', 'PKR');
          const convertedMax = convertAmount(maxUSD, 'USD', 'PKR');
          const minPKR = isNaN(convertedMin) ? "0" : Math.round(convertedMin).toString();
          const maxPKR = isNaN(convertedMax) ? "0" : Math.round(convertedMax).toString();
          return { label: `${symbol}${minPKR} - ${symbol}${maxPKR}`, min: minPKR, max: maxPKR };
        }
      });
    }
  };

  const followerRanges = [
    { label: "1K - 10K", min: "1000", max: "10000" },
    { label: "10K - 50K", min: "10000", max: "50000" },
    { label: "50K - 100K", min: "50000", max: "100000" },
    { label: "100K - 500K", min: "100000", max: "500000" },
    { label: "500K - 1M", min: "500000", max: "1000000" },
    { label: "1M+", min: "1000000", max: "" },
  ];

  const priceRanges = getPriceRanges();

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
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
              {formatAmount(getWalletBalanceInCurrency(), selectedCurrency)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">In Escrow</span>
            <span className="text-sm font-medium text-amber-600">
              {formatAmount(getEscrowBalanceInCurrency(), selectedCurrency)}
            </span>
          </div>
          <Separator />
          <Link href="/wallet">
            <Button variant="outline" size="sm" className="w-full">
              Add Funds
            </Button>
          </Link>
        </CardContent>
      </Card>

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
                <SelectItem value="all">All Categories</SelectItem>
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
            <Label className="text-sm font-medium text-gray-700 mb-2">
              Price Range ({selectedCurrency})
            </Label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow positive numbers or empty string
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    handleInputChange('minPrice', value);
                  }
                }}
                className="text-sm"
                min="0"
                step="any"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow positive numbers or empty string
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    handleInputChange('maxPrice', value);
                  }
                }}
                className="text-sm"
                min="0"
                step="any"
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
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow positive numbers or empty string
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    handleInputChange('minFollowers', value);
                  }
                }}
                className="text-sm"
                min="0"
                step="any"
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxFollowers}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow positive numbers or empty string
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    handleInputChange('maxFollowers', value);
                  }
                }}
                className="text-sm"
                min="0"
                step="any"
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
                    {getCurrencySymbol(selectedCurrency)}{filters.minPrice || '0'} - {getCurrencySymbol(selectedCurrency)}{filters.maxPrice || '∞'}
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
