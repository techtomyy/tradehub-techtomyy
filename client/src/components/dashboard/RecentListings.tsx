import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Target, DollarSign, Eye, TrendingUp, Plus } from "lucide-react";
import { UserListing } from "@/types/dashboard";

interface RecentListingsProps {
  listings: UserListing[];
  getStatusColor: (status: string) => string;
  getCategoryIcon: (category: string) => string;
  onViewAll: () => void;
}

/**
 * Enhanced Recent Listings Component
 * 
 * Displays a beautiful card showing recent listings with options
 * to view all listings, enhanced with animations and better design.
 */
export function RecentListings({ 
  listings, 
  getStatusColor, 
  getCategoryIcon,
  onViewAll
}: RecentListingsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'sold':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <Target className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Recent Listings</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onViewAll} 
                className="hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
              >
                View All <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {listings?.slice(0, 3).map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: -5 }}
              className="group relative overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-white text-lg">
                      {getCategoryIcon(listing.category)}
                    </span>
                  </motion.div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{listing.title}</p>
                    <p className="text-lg font-bold text-emerald-600">
                      ${listing.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 max-w-32 truncate">
                      {listing.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge 
                    className={`${getStatusColor(listing.status)} px-3 py-1 text-xs font-medium border-0 shadow-sm flex items-center gap-1`}
                  >
                    {getStatusIcon(listing.status)}
                    {getStatusText(listing.status)}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    <span>12 views</span>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
          
          {(!listings || listings.length === 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No listings yet</p>
              <p className="text-gray-400 text-sm">Create your first listing to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Listing
              </motion.button>
            </motion.div>
          )}
          
          {/* Summary */}
          {listings && listings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 pt-4 border-t border-gray-200"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <span className="text-gray-600">Total Value:</span>
                  <p className="font-semibold text-gray-900">
                    ${listings.reduce((sum, l) => sum + l.price, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-gray-600">Active:</span>
                  <p className="font-semibold text-gray-900">
                    {listings.filter(l => l.status === 'active').length}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
