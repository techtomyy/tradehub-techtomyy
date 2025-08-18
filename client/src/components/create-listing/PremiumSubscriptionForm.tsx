import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { Upload, Play, Crown, Calendar, Users, DollarSign, Shield } from "lucide-react";
import { Currency } from "@/lib/store/walletStore";
import { formatFileSize, isValidFileSize } from "@/lib/utils";

const premiumSubscriptionSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  serviceType: z.enum(["streaming", "gaming", "software", "music", "other"], {
    required_error: "Please select a service type",
  }),
  serviceName: z.string().min(1, "Service name is required"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  subscriptionType: z.enum(["monthly", "yearly", "lifetime"], {
    required_error: "Please select subscription type",
  }),
  originalPrice: z.string().optional(),
  accountAge: z.string().min(1, "Account age is required"),
  concurrentUsers: z.string().min(1, "Number of concurrent users is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Concurrent users must be a positive number"),
  hasPremiumFeatures: z.boolean().default(false),
  hasAdFree: z.boolean().default(false),
  hasOfflineAccess: z.boolean().default(false),
  hasFamilyPlan: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
  featured: z.boolean().default(false),
});

type PremiumSubscriptionForm = z.infer<typeof premiumSubscriptionSchema>;

interface PremiumSubscriptionFormProps {
  form: ReturnType<typeof useForm<PremiumSubscriptionForm>>;
  onSubmit: (data: PremiumSubscriptionForm) => void;
  isSubmitting: boolean;
  selectedCurrency: string;
}

/**
 * Premium Subscription Form Component
 * 
 * Specialized form for premium subscription assets like
 * Netflix, Prime Video, gaming subscriptions, etc.
 */
export function PremiumSubscriptionForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  selectedCurrency 
}: PremiumSubscriptionFormProps) {
  const { getCurrencySymbol } = useCurrency();

  const getServiceTypeDescription = (serviceType: string) => {
    switch (serviceType) {
      case 'streaming': return 'Streaming services like Netflix, Prime Video, Disney+';
      case 'gaming': return 'Gaming subscriptions like Xbox Game Pass, PlayStation Plus';
      case 'software': return 'Software subscriptions like Adobe Creative Cloud, Microsoft 365';
      case 'music': return 'Music streaming services like Spotify Premium, Apple Music';
      case 'other': return 'Other premium subscription services';
      default: return '';
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'streaming': return '🎬';
      case 'gaming': return '🎮';
      case 'software': return '💻';
      case 'music': return '🎵';
      case 'other': return '⭐';
      default: return '⭐';
    }
  };

  const getSubscriptionTypeDescription = (type: string) => {
    switch (type) {
      case 'monthly': return 'Monthly subscription';
      case 'yearly': return 'Annual subscription (usually discounted)';
      case 'lifetime': return 'One-time purchase, no recurring fees';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getServiceTypeIcon(form.watch('serviceType') || 'streaming')}</span>
          Premium Subscription Asset Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Netflix Premium Account with 4K Streaming" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear, descriptive title for your subscription asset
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="streaming">🎬 Streaming Service</SelectItem>
                        <SelectItem value="gaming">🎮 Gaming Subscription</SelectItem>
                        <SelectItem value="software">💻 Software Subscription</SelectItem>
                        <SelectItem value="music">🎵 Music Streaming</SelectItem>
                        <SelectItem value="other">⭐ Other Premium Service</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value && getServiceTypeDescription(field.value)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Netflix, Xbox Game Pass, Adobe Creative Cloud" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the premium service or platform
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your subscription asset, its features, benefits, account status, etc."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about your subscription to attract buyers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Price ({getCurrencySymbol(selectedCurrency as Currency)})</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set your asking price for the subscription
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Monthly Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The regular monthly cost of this subscription
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subscriptionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subscription type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">📅 Monthly</SelectItem>
                        <SelectItem value="yearly">📅 Yearly</SelectItem>
                        <SelectItem value="lifetime">👑 Lifetime</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value && getSubscriptionTypeDescription(field.value)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Age</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 years" {...field} />
                      </FormControl>
                      <FormDescription>
                        How long you've had this account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="concurrentUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Concurrent Users</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          min="1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of users who can use the account simultaneously
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Premium Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Premium Features</h3>
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="hasPremiumFeatures"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Premium Features Enabled</FormLabel>
                        <FormDescription>
                          Check if the account has access to premium features
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasAdFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Ad-Free Experience</FormLabel>
                        <FormDescription>
                          Check if the subscription includes ad-free content
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasOfflineAccess"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Offline Access</FormLabel>
                        <FormDescription>
                          Check if content can be downloaded for offline use
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasFamilyPlan"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Family Plan</FormLabel>
                        <FormDescription>
                          Check if this is a family or multi-user plan
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Listing</FormLabel>
                        <FormDescription>
                          Promote this listing as a featured asset (additional fee may apply)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Asset Proof */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Asset Proof</h3>
              
              <FormField
                control={form.control}
                name="assetProofImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Ownership Proof</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload a screenshot proving ownership of this subscription
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Maximum file size: 2MB
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (!isValidFileSize(file, 2)) {
                                e.target.value = '';
                                return;
                              }
                              field.onChange(file);
                            }
                          }}
                        />
                        {field.value && (
                          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-700">
                              ✓ {field.value.name} ({formatFileSize(field.value.size)})
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Screenshot showing you own this subscription (required, max 2MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Listing..." : "Create Premium Subscription Listing"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
