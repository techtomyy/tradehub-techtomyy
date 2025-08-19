import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Phone,
  Mail,
  Shield,
  Gavel,
  Users,
  Calendar,
  Flag,
  Send,
  Paperclip,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  Info
} from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EscrowDeal {
  id: string;
  deal: string;
  counterparty: string;
  amountHeld: number;
}

interface DisputeCase {
  id: string;
  dealId: string;
  dealName: string;
  status: 'pending' | 'under_review' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedAt: string;
  lastUpdated: string;
  description: string;
  attachments: string[];
  messages: number;
  estimatedResolution: string;
}

interface DisputeResolutionProps {
  deals: EscrowDeal[];
  onSubmitDispute: (dealId: string, disputeDetails: string, attachments?: File[]) => void;
  isLoading?: boolean;
}

/**
 * Enhanced Dispute Resolution Component
 * 
 * Features:
 * - Animated dispute submission form
 * - File upload with drag & drop
 * - Dispute tracking and history
 * - Real-time status updates
 * - Priority levels and escalation
 * - Interactive timeline
 * - Enhanced visual design with gradients
 * - Dispute case management
 * - Communication tracking
 */
export function DisputeResolution({ 
  deals, 
  onSubmitDispute, 
  isLoading = false 
}: DisputeResolutionProps) {
  const [selectedDealId, setSelectedDealId] = useState("");
  const [disputeDetails, setDisputeDetails] = useState("");
  const [disputeType, setDisputeType] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<"submit" | "track">("submit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock dispute cases
  const [disputeCases] = useState<DisputeCase[]>([
    {
      id: "1",
      dealId: "1",
      dealName: "YouTube Channel - 150K Subs",
      status: "under_review",
      priority: "high",
      submittedAt: "2025-08-15T10:30:00Z",
      lastUpdated: "2025-08-18T14:20:00Z",
      description: "Buyer claims channel doesn't meet subscriber count requirements",
      attachments: ["screenshot1.png", "contract.pdf"],
      messages: 5,
      estimatedResolution: "2025-08-22"
    },
    {
      id: "2",
      dealId: "2",
      dealName: "Instagram Account - 50K Followers",
      status: "resolved",
      priority: "medium",
      submittedAt: "2025-08-10T09:15:00Z",
      lastUpdated: "2025-08-16T11:45:00Z",
      description: "Payment delay issue resolved",
      attachments: ["payment_proof.pdf"],
      messages: 3,
      estimatedResolution: "2025-08-16"
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDealId && disputeDetails) {
      onSubmitDispute(selectedDealId, disputeDetails, attachments.length > 0 ? attachments : undefined);
      // Reset form after submission
      setSelectedDealId("");
      setDisputeDetails("");
      setDisputeType("");
      setPriority("medium");
      setAttachments([]);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'escalated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'under_review':
        return <Eye className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'escalated':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-white shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Gavel className="h-6 w-6 mr-2 text-red-600" />
              Dispute Resolution Center
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Submit and track disputes with comprehensive support and real-time updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Users className="h-3 w-3 mr-1" />
              {disputeCases.length} Cases
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("submit")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "submit"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Flag className="h-4 w-4 mr-2 inline" />
            Submit Dispute
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "track"
                ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Eye className="h-4 w-4 mr-2 inline" />
            Track Cases ({disputeCases.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "submit" && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Deal Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deal in Dispute *
                  </label>
                  <Select value={selectedDealId} onValueChange={setSelectedDealId} required>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select a deal" />
                    </SelectTrigger>
                    <SelectContent>
                      {deals.map((deal) => (
                        <SelectItem key={deal.id} value={deal.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{deal.deal}</span>
                            <span className="text-xs text-gray-500">${deal.amountHeld}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dispute Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dispute Type *
                  </label>
                  <Select value={disputeType} onValueChange={setDisputeType} required>
                    <SelectTrigger className="w-full bg-white border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select dispute type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment Issue</SelectItem>
                      <SelectItem value="quality">Quality/Service Issue</SelectItem>
                      <SelectItem value="delivery">Delivery Problem</SelectItem>
                      <SelectItem value="communication">Communication Issue</SelectItem>
                      <SelectItem value="fraud">Suspected Fraud</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['low', 'medium', 'high', 'urgent'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPriority(level)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          priority === level
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-medium">{level}</span>
                          {priority === level && <CheckCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dispute Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dispute Details *
                  </label>
                  <Textarea
                    placeholder="Please provide a detailed description of the issue, including relevant dates, communications, and any supporting information..."
                    value={disputeDetails}
                    onChange={(e) => setDisputeDetails(e.target.value)}
                    rows={5}
                    className="w-full bg-white border-gray-300 focus:border-red-500 focus:ring-red-500 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Be as specific as possible to help us resolve your dispute quickly.
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents
                  </label>
                  <motion.div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      isDragOver
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop files here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 10MB each
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </motion.div>

                  {/* Attachments List */}
                  {attachments.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 space-y-2"
                    >
                      {attachments.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? "Submitting..." : "Submit Dispute for Review"}
                  </Button>
                </motion.div>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">What happens next?</h4>
                      <ul className="text-sm text-blue-800 mt-1 space-y-1">
                        <li>• Your dispute will be reviewed within 24 hours</li>
                        <li>• Our mediation team will contact both parties</li>
                        <li>• Resolution typically takes 3-7 business days</li>
                        <li>• You'll receive updates via email and dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === "track" && (
            <motion.div
              key="track"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="space-y-4">
                {disputeCases.map((dispute, index) => (
                  <motion.div
                    key={dispute.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{dispute.dealName}</h3>
                          <Badge className={getStatusColor(dispute.status)}>
                            {getStatusIcon(dispute.status)}
                            <span className="ml-1 capitalize">{dispute.status.replace('_', ' ')}</span>
                          </Badge>
                          <Badge className={getPriorityColor(dispute.priority)}>
                            {dispute.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Submitted: {new Date(dispute.submittedAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(dispute.lastUpdated).toLocaleDateString()}</span>
                          <span>Est. Resolution: {dispute.estimatedResolution}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {dispute.messages}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Paperclip className="h-4 w-4 mr-1" />
                          {dispute.attachments.length}
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>
                          {dispute.status === 'pending' ? '25%' :
                           dispute.status === 'under_review' ? '50%' :
                           dispute.status === 'resolved' ? '100%' : '75%'}
                        </span>
                      </div>
                      <Progress 
                        value={
                          dispute.status === 'pending' ? 25 :
                          dispute.status === 'under_review' ? 50 :
                          dispute.status === 'resolved' ? 100 : 75
                        } 
                        className="h-2"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Send Message
                      </Button>
                      {dispute.attachments.length > 0 && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download Files
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
