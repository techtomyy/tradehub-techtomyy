import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";

interface TimelineStep {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'pending';
}

interface DealStatusTimelineProps {
  steps: TimelineStep[];
}

/**
 * Deal Status Timeline Component
 * 
 * Displays a timeline showing the progression of a deal
 * through different stages with status indicators.
 */
export function DealStatusTimeline({ steps }: DealStatusTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                step.status === 'completed' 
                  ? 'bg-green-500' 
                  : 'bg-orange-500'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="w-3 h-3 text-white" />
                ) : (
                  <Clock className="w-3 h-3 text-white" />
                )}
              </div>
              <div className="flex-1">
                <span className={`font-medium ${
                  step.status === 'completed' ? 'text-green-700' : 'text-orange-700'
                }`}>
                  {step.title}
                </span>
                <span className="text-gray-500 ml-2">- {step.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
