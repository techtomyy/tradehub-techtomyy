import { useState } from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function DisputePage() {
  const { transactionId } = useParams(); // Get transaction ID from URL
  const [reason, setReason] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setStatus("Under Review");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link href="/Home">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Dispute Resolution
            </CardTitle>
            <p className="text-sm text-gray-500">
              Transaction ID: <span className="font-mono">{transactionId}</span>
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Reason for Dispute */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reason for Dispute
                </label>
                <Textarea
                  placeholder="Describe the issue..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              {/* Attach Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attach Proof
                </label>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              {/* Status Display */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Status:</strong> {status}
                </p>
                {status === "Under Review" && (
                  <p className="text-sm text-gray-600">
                    <strong>Admin Note:</strong> Please allow 24-48h for resolution.
                  </p>
                )}
              </div>

              {/* Decision Display */}
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Decision:</strong> {status === "Pending" ? "Pending" : "Awaiting Admin Decision"}
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Dispute"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
