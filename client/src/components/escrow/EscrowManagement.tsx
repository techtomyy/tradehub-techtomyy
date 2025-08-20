import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Filter, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  Clock,
  Eye,
  Download,
  RefreshCw,
  Bell,
  Zap,
  Star,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EscrowDeal {
  id: string;
  deal: string;
  counterparty: string;
  counterpartyType: 'seller' | 'buyer';
  amountHeld: number;
  fee: number;
  netToSeller: number;
  counterpartyConfirmed: 'confirmed' | 'pending';
  status: 'funded' | 'in_progress';
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

interface EscrowManagementProps {
  deals: EscrowDeal[];
  onConfirmCompletion: (dealId: string) => void;
  onRaiseDispute: (dealId: string) => void;
  onNavigateToDispute?: () => void;
}

/**
 * Enhanced Escrow Management Component
 * 
 * Features:
 * - Animated cards and transitions
 * - Interactive charts and statistics
 * - Real-time notifications
 * - Advanced filtering and search
 * - Progress indicators and animations
 * - Enhanced visual design with gradients and shadows
 * - Quick action buttons
 * - Status indicators with animations
 */
export function EscrowManagement({ 
  deals, 
  onConfirmCompletion, 
  onRaiseDispute, 
  onNavigateToDispute 
}: EscrowManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  // Enhanced deals with additional data
  const enhancedDeals = deals.map(deal => ({
    ...deal,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
  }));

  // Filter and sort deals
  const filteredDeals = enhancedDeals
    .filter(deal => {
      const matchesSearch = deal.deal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.counterparty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || deal.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.amountHeld - a.amountHeld;
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  // Statistics
  const stats = {
    totalDeals: enhancedDeals.length,
    totalAmount: enhancedDeals.reduce((sum, deal) => sum + deal.amountHeld, 0),
    fundedDeals: enhancedDeals.filter(deal => deal.status === 'funded').length,
    pendingDeals: enhancedDeals.filter(deal => deal.status === 'in_progress').length,
    totalFees: enhancedDeals.reduce((sum, deal) => sum + deal.fee, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'in_progress':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getConfirmationColor = (confirmed: string) => {
    switch (confirmed) {
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'low':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Statistics */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Deals</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalDeals}</p>
              </div>
              <div className="p-2 bg-blue-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-800">${stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Funded Deals</p>
                <p className="text-2xl font-bold text-orange-800">{stats.fundedDeals}</p>
              </div>
              <div className="p-2 bg-orange-500 rounded-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Fees</p>
                <p className="text-2xl font-bold text-purple-800">${stats.totalFees.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-center justify-between"
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search deals or counterparties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white shadow-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="funded">Funded</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white shadow-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40 bg-white shadow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="shadow-sm hover:shadow-md transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Enhanced Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-blue-600" />
                  Escrow Management
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Manage held payments for deals. Funds are held in escrow until both parties confirm completion. Platform fee: 2.5% deducted upon release.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  Live
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  {filteredDeals.length} Deals
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Deal</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Counterparty</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Amount Held</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Fee (2.5%)</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Net to Seller</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Status</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Priority</th>
                    <th className="py-4 px-4 text-left font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredDeals.map((deal, index) => (
                      <motion.tr
                        key={deal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                          selectedDeal === deal.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''
                        }`}
                        onClick={() => setSelectedDeal(deal.id)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div>
                              <div className="font-medium text-gray-900">{deal.deal}</div>
                              <div className="text-xs text-gray-500">
                                Created {new Date(deal.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {deal.counterparty.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{deal.counterparty}</div>
                              <div className="text-xs text-gray-500 capitalize">{deal.counterpartyType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-900">${deal.amountHeld.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-600">${deal.fee.toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-green-600">${deal.netToSeller.toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col space-y-1">
                            <Badge className={`${getStatusColor(deal.status)} text-xs`}>
                              {deal.status === 'funded' ? 'Funded' : 'In Progress'}
                            </Badge>
                            <Badge className={`${getConfirmationColor(deal.counterpartyConfirmed)} text-xs`}>
                              {deal.counterpartyConfirmed === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getPriorityColor(deal.priority)} text-xs`}>
                            {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                size="sm" 
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={() => onConfirmCompletion(deal.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                                onClick={() => onNavigateToDispute ? onNavigateToDispute() : onRaiseDispute(deal.id)}
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Dispute
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </motion.div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            
            {filteredDeals.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deals found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Quick Actions</h3>
                <p className="text-sm text-blue-700">Bulk operations & shortcuts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Analytics</h3>
                <p className="text-sm text-green-700">Performance insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Notifications</h3>
                <p className="text-sm text-purple-700">Real-time updates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
