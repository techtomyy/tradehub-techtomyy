import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: 'USD' | 'PKR';
  formatAmount: (amount: number, currency: 'USD' | 'PKR') => string;
  convertAmount: (amount: number, fromCurrency: 'USD' | 'PKR', toCurrency: 'USD' | 'PKR') => number;
}

interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: number;
  conversionRate: number;
  successRate: number;
  monthlyTrend: 'up' | 'down';
  conversionTrend: 'up' | 'down';
  successTrend: 'up' | 'down';
}

export function AnalyticsModal({ isOpen, onClose, selectedCurrency, formatAmount, convertAmount }: AnalyticsModalProps) {
  // Mock analytics data - in a real app, this would come from an API
  const analyticsData: AnalyticsData = {
    totalRevenue: 125000,
    monthlyRevenue: 18500,
    conversionRate: 68.5,
    successRate: 94.2,
    monthlyTrend: 'up',
    conversionTrend: 'up',
    successTrend: 'up'
  };

  // Sample chart data
  const revenueData = [
    { month: 'Jan', revenue: 12000, target: 15000 },
    { month: 'Feb', revenue: 13500, target: 15000 },
    { month: 'Mar', revenue: 14200, target: 15000 },
    { month: 'Apr', revenue: 15800, target: 15000 },
    { month: 'May', revenue: 16500, target: 15000 },
    { month: 'Jun', revenue: 18500, target: 15000 }
  ];

  const conversionData = [
    { month: 'Jan', rate: 62, target: 70 },
    { month: 'Feb', rate: 65, target: 70 },
    { month: 'Mar', rate: 67, target: 70 },
    { month: 'Apr', rate: 69, target: 70 },
    { month: 'May', rate: 71, target: 70 },
    { month: 'Jun', rate: 68.5, target: 70 }
  ];

  // Convert amounts based on selected currency
  const getConvertedAmount = (amount: number) => {
    if (selectedCurrency === 'PKR') {
      return convertAmount(amount, 'USD', 'PKR');
    }
    return amount;
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (trend: 'up' | 'down') => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendText = (trend: 'up' | 'down') => {
    return trend === 'up' ? '+12.5%' : '-8.3%';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Analytics Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                                 <CardContent>
                   <div className="text-2xl font-bold text-gray-900">
                     {formatAmount(getConvertedAmount(analyticsData.totalRevenue), selectedCurrency)}
                   </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.monthlyTrend)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.monthlyTrend)}`}>
                      {getTrendText(analyticsData.monthlyTrend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                                 <CardContent>
                   <div className="text-2xl font-bold text-gray-900">
                     {formatAmount(getConvertedAmount(analyticsData.monthlyRevenue), selectedCurrency)}
                   </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.monthlyTrend)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.monthlyTrend)}`}>
                      {getTrendText(analyticsData.monthlyTrend)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData.conversionRate}%
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.conversionTrend)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.conversionTrend)}`}>
                      +5.2%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData.successRate}%
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(analyticsData.successTrend)}
                    <span className={`text-sm font-medium ${getTrendColor(analyticsData.successTrend)}`}>
                      +2.1%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {/* Revenue Chart */}
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.4, delay: 0.5 }}
             >
               <Card className="border-0 shadow-lg">
                 <CardHeader>
                   <CardTitle className="text-lg font-semibold text-gray-900">Revenue Overview</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={revenueData}>
                         <defs>
                           <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                           </linearGradient>
                           <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="month" 
                           stroke="#6b7280" 
                           fontSize={12}
                           tickLine={false}
                         />
                         <YAxis 
                           stroke="#6b7280" 
                           fontSize={12}
                           tickLine={false}
                           tickFormatter={(value) => {
                             const convertedValue = getConvertedAmount(value);
                             return selectedCurrency === 'PKR' 
                               ? `₨${(convertedValue / 1000000).toFixed(1)}M` 
                               : `$${(value / 1000).toFixed(0)}k`;
                           }}
                         />
                         <Tooltip 
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '8px',
                             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                           }}
                           formatter={(value, name) => {
                             const convertedValue = getConvertedAmount(value);
                             const formattedValue = selectedCurrency === 'PKR' 
                               ? formatAmount(convertedValue, 'PKR')
                               : `$${value.toLocaleString()}`;
                             return [
                               formattedValue,
                               name === 'revenue' ? 'Revenue' : 'Target'
                             ];
                           }}
                         />
                         <Area
                           type="monotone"
                           dataKey="revenue"
                           stroke="#10b981"
                           strokeWidth={3}
                           fill="url(#revenueGradient)"
                           name="revenue"
                         />
                         <Area
                           type="monotone"
                           dataKey="target"
                           stroke="#f59e0b"
                           strokeWidth={2}
                           strokeDasharray="5 5"
                           fill="url(#targetGradient)"
                           name="target"
                         />
                       </AreaChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>

                         {/* Conversion Rate Chart */}
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.4, delay: 0.6 }}
             >
               <Card className="border-0 shadow-lg">
                 <CardHeader>
                   <CardTitle className="text-lg font-semibold text-gray-900">Conversion Analytics</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={conversionData}>
                         <defs>
                           <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                           </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                         <XAxis 
                           dataKey="month" 
                           stroke="#6b7280" 
                           fontSize={12}
                           tickLine={false}
                         />
                         <YAxis 
                           stroke="#6b7280" 
                           fontSize={12}
                           tickLine={false}
                           domain={[0, 100]}
                           tickFormatter={(value) => `${value}%`}
                         />
                         <Tooltip 
                           contentStyle={{
                             backgroundColor: 'white',
                             border: '1px solid #e5e7eb',
                             borderRadius: '8px',
                             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                           }}
                           formatter={(value, name) => [
                             `${value}%`,
                             name === 'rate' ? 'Conversion Rate' : 'Target'
                           ]}
                         />
                         <Line
                           type="monotone"
                           dataKey="rate"
                           stroke="#3b82f6"
                           strokeWidth={3}
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                           activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                           name="rate"
                         />
                         <Line
                           type="monotone"
                           dataKey="target"
                           stroke="#f59e0b"
                           strokeWidth={2}
                           strokeDasharray="5 5"
                           dot={false}
                           name="target"
                         />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
          </div>

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {analyticsData.totalRevenue > 100000 ? 'Excellent' : 'Good'}
                    </div>
                    <p className="text-sm text-gray-600">Overall Performance</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {analyticsData.conversionRate > 70 ? 'High' : 'Medium'}
                    </div>
                    <p className="text-sm text-gray-600">Conversion Quality</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {analyticsData.successRate > 95 ? 'Outstanding' : 'Very Good'}
                    </div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
