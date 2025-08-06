import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  Flag,
} from "lucide-react";
import { Link } from "wouter";
interface TransactionCardProps {
  transaction: {
    id: string;
    buyerId: string;
    sellerId: string;
    listingId: string;
    amount: string;
    buyerFee: string;
    sellerFee: string;
    totalAmount: string;
    status: string;
    verificationDeadline?: string;
    disputeReason?: string;
    createdAt: string;
    updatedAt: string;
    listing?: {
      title: string;
      category: string;
    };
    buyer?: {
      firstName?: string;
      lastName?: string;
    };
    seller?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'instagram': return '📷';
      case 'youtube': return '📹';
      case 'tiktok': return '🎵';
      case 'twitter': return '🐦';
      case 'website': return '🌐';
      default: return '💻';
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'initiated':
        return {
          label: 'Payment Pending',
          color: 'bg-gray-100 text-gray-800',
          progress: 25,
          icon: Clock,
        };
      case 'payment_received':
        return {
          label: 'Payment Received',
          color: 'bg-blue-100 text-blue-800',
          progress: 50,
          icon: CheckCircle,
        };
      case 'credentials_sent':
        return {
          label: 'Credentials Sent',
          color: 'bg-yellow-100 text-yellow-800',
          progress: 75,
          icon: Clock,
        };
      case 'verified':
        return {
          label: 'Awaiting Release',
          color: 'bg-yellow-100 text-yellow-800',
          progress: 90,
          icon: Clock,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-emerald-100 text-emerald-800',
          progress: 100,
          icon: CheckCircle,
        };
      case 'disputed':
        return {
          label: 'Disputed',
          color: 'bg-red-100 text-red-800',
          progress: 50,
          icon: AlertTriangle,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'bg-gray-100 text-gray-800',
          progress: 0,
          icon: AlertTriangle,
        };
      default:
        return {
          label: status.replace('_', ' '),
          color: 'bg-gray-100 text-gray-800',
          progress: 0,
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusInfo(transaction.status);
  const StatusIcon = statusInfo.icon;

  const amount = parseFloat(transaction.amount);

  // Static time remaining calculation - for demo purposes
  const timeRemaining = transaction.verificationDeadline
    ? Math.max(0, Math.ceil((new Date(transaction.verificationDeadline).getTime() - Date.now()) / (1000 * 60 * 60)))
    : null;

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">
                {getCategoryIcon(transaction.listing?.category)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {transaction.listing?.title || 'Asset Purchase'}
              </h4>
              <p className="text-sm text-gray-600">
                Transaction #{transaction.id.toString().slice(-8)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              ${amount.toLocaleString()}
            </p>
            <Badge className={statusInfo.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Transaction Progress</span>
            {timeRemaining !== null && timeRemaining > 0 && (
              <span className="text-amber-600">
                {timeRemaining}h remaining
              </span>
            )}
          </div>
          <Progress value={statusInfo.progress} className="h-2" />
        </div>

        {/* Transaction Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center text-sm">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${statusInfo.progress >= 25 ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              {statusInfo.progress >= 25 ? <CheckCircle className="h-3 w-3" /> : '1'}
            </div>
            <span className={statusInfo.progress >= 25 ? 'text-gray-900' : 'text-gray-500'}>
              Payment
            </span>
          </div>
          <div className="flex items-center text-sm">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${statusInfo.progress >= 50 ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              {statusInfo.progress >= 50 ? <CheckCircle className="h-3 w-3" /> : '2'}
            </div>
            <span className={statusInfo.progress >= 50 ? 'text-gray-900' : 'text-gray-500'}>
              Escrow
            </span>
          </div>
          <div className="flex items-center text-sm">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${statusInfo.progress >= 75 ? 'bg-emerald-500 text-white' :
                statusInfo.progress >= 50 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              {statusInfo.progress >= 75 ? <CheckCircle className="h-3 w-3" /> : '3'}
            </div>
            <span className={statusInfo.progress >= 75 ? 'text-gray-900' :
              statusInfo.progress >= 50 ? 'text-primary font-medium' : 'text-gray-500'}>
              Transfer
            </span>
          </div>
          <div className="flex items-center text-sm">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${statusInfo.progress >= 100 ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
              {statusInfo.progress >= 100 ? <CheckCircle className="h-3 w-3" /> : '4'}
            </div>
            <span className={statusInfo.progress >= 100 ? 'text-gray-900' : 'text-gray-500'}>
              Complete
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {transaction.status === 'credentials_sent' && (
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify & Complete
            </Button>
          )}

          {transaction.status !== 'completed' && (
            <Link href={`/message/${transaction.id}`}>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </Link>
          )}

          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>

          {['payment_received', 'credentials_sent', 'verified'].includes(transaction.status) && (
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <Flag className="h-4 w-4 mr-2" />
              Dispute
            </Button>
          )}
        </div>

        {/* Dispute Info */}
        {transaction.status === 'disputed' && transaction.disputeReason && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <div className="flex items-center text-red-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Dispute Reason:</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{transaction.disputeReason}</p>
          </div>
        )}

        {/* Time Warning */}
        {timeRemaining !== null && timeRemaining > 0 && timeRemaining <= 24 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center text-amber-800">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm">
                <strong>{timeRemaining} hours</strong> remaining to verify the asset
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
