import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Shield, 
  Users, 
  DollarSign,
  FileText,
  Send,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  Zap,
  Star,
  TrendingUp,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Share2,
  Download,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Target,
  Award,
  Timer,
  Sparkles,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface InitiateNewEscrowProps {
  onCreateEscrow: (dealDescription: string, counterpartyUsername: string, amount: number) => void;
  isLoading?: boolean;
}

interface EscrowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'error';
}

/**
 * Enhanced Initiate New Escrow Component
 * 
 * Features:
 * - Interactive step-by-step wizard
 * - Animated progress indicators
 * - Real-time validation and feedback
 * - Enhanced visual design with gradients
 * - Interactive timeline
 * - Advanced form controls
 * - Progress tracking and completion
 * - Modern UI with animations
 */
export function InitiateNewEscrow({ onCreateEscrow, isLoading = false }: InitiateNewEscrowProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [dealDescription, setDealDescription] = useState("");
  const [counterpartyUsername, setCounterpartyUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [dealType, setDealType] = useState("");
  const [escrowDuration, setEscrowDuration] = useState("7");
  const [showAmount, setShowAmount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [escrowId, setEscrowId] = useState("");
  const [invitationLink, setInvitationLink] = useState("");

  // Enhanced steps with icons and descriptions
  const steps: EscrowStep[] = [
    {
      id: "details",
      title: "Deal Details",
      description: "Enter the basic information about your deal",
      icon: <FileText className="h-5 w-5" />,
      status: 'active'
    },
    {
      id: "counterparty",
      title: "Counterparty",
      description: "Specify the other party involved",
      icon: <Users className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: "amount",
      title: "Amount & Terms",
      description: "Set the escrow amount and conditions",
      icon: <DollarSign className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: "review",
      title: "Review & Create",
      description: "Review details and create escrow",
      icon: <Shield className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: "invite",
      title: "Invite Counterparty",
      description: "Send invitation to complete setup",
      icon: <Send className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: "dispute",
      title: "Dispute Resolution",
      description: "Submit and track disputes",
      icon: <AlertTriangle className="h-5 w-5" />,
      status: 'pending'
    }
  ];

  // Update step statuses
  const updateStepStatus = (stepIndex: number, status: EscrowStep['status']) => {
    steps[stepIndex].status = status;
  };

  // Progress percentage
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Generate escrow ID
  const generateEscrowId = () => {
    return `ESC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  // Generate invitation link
  const generateInvitationLink = () => {
    return `${window.location.origin}/escrow/join/${escrowId}`;
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      updateStepStatus(currentStep, 'completed');
      updateStepStatus(currentStep + 1, 'active');
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      updateStepStatus(currentStep, 'pending');
      updateStepStatus(currentStep - 1, 'active');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dealDescription.trim() || !counterpartyUsername.trim() || !amount.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const newEscrowId = generateEscrowId();
      setEscrowId(newEscrowId);
      setInvitationLink(generateInvitationLink());
      
      onCreateEscrow(dealDescription, counterpartyUsername, parseFloat(amount));
      
      toast({
        title: "Escrow Created Successfully!",
        description: `Escrow ID: ${newEscrowId}`,
      });
      
      setIsProcessing(false);
      handleNext();
    }, 2000);
  };

  // Get step content based on current step
  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Digital Asset', 'Service', 'Physical Item', 'Account Transfer'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDealType(type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      dealType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{type}</span>
                      {dealType === type && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Description *
              </label>
              <Textarea
                placeholder="Describe what you're selling or buying in detail..."
                value={dealDescription}
                onChange={(e) => setDealDescription(e.target.value)}
                rows={4}
                className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                required
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Counterparty Username *
              </label>
              <Input
                type="text"
                placeholder="Enter the username of the other party"
                value={counterpartyUsername}
                onChange={(e) => setCounterpartyUsername(e.target.value)}
                className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Make sure you have the correct username to avoid delays
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Counterparty Verification</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    We'll verify the counterparty exists and send them an invitation to join the escrow.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escrow Amount *
              </label>
              <div className="relative">
                <Input
                  type={showAmount ? "text" : "password"}
                  placeholder="Enter amount (e.g., 2500)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAmount(!showAmount)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showAmount ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escrow Duration (Days)
              </label>
              <Select value={escrowDuration} onValueChange={setEscrowDuration}>
                <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Security Features</h4>
                  <ul className="text-sm text-green-800 mt-1 space-y-1">
                    <li>• Funds held securely in escrow</li>
                    <li>• 2.5% platform fee applied</li>
                    <li>• Dispute resolution available</li>
                    <li>• Automatic release after {escrowDuration} days</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-4">Review Your Escrow Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deal Type:</span>
                  <span className="font-medium">{dealType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-medium">{dealDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Counterparty:</span>
                  <span className="font-medium">{counterpartyUsername}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{escrowDuration} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium">${(parseFloat(amount) * 0.025).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Net Amount:</span>
                  <span className="font-bold text-green-600">${(parseFloat(amount) * 0.975).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Important Notice</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    By creating this escrow, you agree to our terms of service. The counterparty will need to accept the invitation to proceed.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Escrow Created Successfully!</h3>
              <p className="text-gray-600 mb-6">Your escrow is ready. Share the invitation link with your counterparty.</p>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Escrow ID:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">{escrowId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Invitation Link:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(invitationLink)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Timer className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Next Steps</h4>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• Counterparty receives invitation</li>
                    <li>• Both parties confirm participation</li>
                    <li>• Funds are held in escrow</li>
                    <li>• Deal completion or dispute resolution</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dispute Resolution Center</h3>
              <p className="text-gray-600">Submit and track disputes with comprehensive support and real-time updates.</p>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Need to File a Dispute?</h4>
                  <p className="text-sm text-red-800 mt-1">
                    If you encounter issues with your escrow transaction, you can file a dispute for our team to review.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.location.href = '/dispute'}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                File New Dispute
              </Button>
              <Button 
                variant="outline"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                onClick={() => window.location.href = '/disputes'}
              >
                <Eye className="h-4 w-4 mr-2" />
                View My Disputes
              </Button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Dispute Resolution Process</h4>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• Submit dispute with detailed information</li>
                    <li>• Our team reviews within 24 hours</li>
                    <li>• Mediation between both parties</li>
                    <li>• Resolution typically takes 3-7 business days</li>
                    <li>• Updates provided via email and dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-white shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-green-600" />
              Create New Escrow
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Set up a secure escrow transaction with step-by-step guidance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Shield className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-gray-200" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  index <= currentStep
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {getStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-2">
            {currentStep === 4 && (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Create Escrow
                  </>
                )}
              </Button>
            )}
            
            {currentStep < 4 && (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
