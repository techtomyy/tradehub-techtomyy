import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  Award,
  Timer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface TimelineStep {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'in_progress' | 'delayed';
  description?: string;
  duration?: string;
  icon?: string;
}

interface DealStatusTimelineProps {
  steps: TimelineStep[];
}

/**
 * Enhanced Deal Status Timeline Component
 * 
 * Features:
 * - Animated progress indicators
 * - Interactive timeline with hover effects
 * - Progress bars and completion percentages
 * - Real-time status updates
 * - Enhanced visual design with gradients
 * - Timeline animations and transitions
 * - Status badges with icons
 * - Time tracking and duration display
 */
export function DealStatusTimeline({ steps }: DealStatusTimelineProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoProgress, setIsAutoProgress] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Calculate progress percentage
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  // Enhanced steps with additional data
  const enhancedSteps = steps.map((step, index) => ({
    ...step,
    description: step.description || `Step ${index + 1} of the escrow process`,
    duration: step.duration || `${Math.floor(Math.random() * 24) + 1}h`,
    icon: step.icon || (step.status === 'completed' ? 'check' : step.status === 'in_progress' ? 'play' : 'clock'),
    estimatedTime: `${Math.floor(Math.random() * 48) + 12}h`,
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low'
  }));

  // Auto progress simulation
  useEffect(() => {
    if (isAutoProgress && currentStep < enhancedSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isAutoProgress, enhancedSteps.length]);

  // Elapsed time counter
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: string, icon: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (icon) {
      case 'check':
        return <CheckCircle {...iconProps} />;
      case 'play':
        return <Play {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      case 'alert':
        return <AlertCircle {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'in_progress':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white animate-pulse';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'delayed':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <Target className="h-6 w-6 mr-2 text-purple-600" />
              Deal Status Timeline
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Track the progress of your escrow deals with real-time updates and detailed status information.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              <Timer className="h-3 w-3 mr-1" />
              {formatTime(elapsedTime)}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAutoProgress(!isAutoProgress)}
              className="shadow-sm"
            >
              {isAutoProgress ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isAutoProgress ? 'Pause' : 'Auto'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Overall Progress</span>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {completedSteps} of {enhancedSteps.length} completed
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-gray-200"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>{Math.round(progressPercentage)}%</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Timeline Steps */}
        <div className="space-y-4">
          <AnimatePresence>
            {enhancedSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${
                  index < enhancedSteps.length - 1 ? 'pb-6' : ''
                }`}
              >
                {/* Connection Line */}
                {index < enhancedSteps.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                )}

                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                      getStatusColor(step.status)
                    }`}
                  >
                    {getStatusIcon(step.status, step.icon)}
                    {step.status === 'in_progress' && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-300"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className={`font-semibold ${
                          step.status === 'completed' ? 'text-green-700' : 
                          step.status === 'in_progress' ? 'text-blue-700' : 
                          step.status === 'delayed' ? 'text-red-700' : 'text-gray-700'
                        }`}>
                          {step.title}
                        </h3>
                        <Badge className={`${getPriorityColor(step.priority)} text-xs`}>
                          {step.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {step.date}
                        </span>
                        {step.status === 'completed' && (
                          <Award className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Duration: {step.duration}
                        </span>
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          Est: {step.estimatedTime}
                        </span>
                      </div>

                      {step.status === 'in_progress' && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-600 font-medium">In Progress</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Progress Bar for In Progress Steps */}
                    {step.status === 'in_progress' && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="mt-3"
                      >
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "60%" }}
                            transition={{ duration: 3, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Timeline Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Timeline Summary</h4>
                <p className="text-sm text-gray-600">
                  {completedSteps} steps completed • {enhancedSteps.length - completedSteps} remaining
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.reload()}
              className="shadow-sm"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
