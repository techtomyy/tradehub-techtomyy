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
import { Upload, AlertCircle, Users, TrendingUp, Eye, DollarSign, Calendar } from "lucide-react";
import { Currency } from "@/lib/store/walletStore";
import { formatFileSize, isValidFileSize } from "@/lib/utils";

const socialMediaSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  platform: z.enum(["instagram", "youtube", "tiktok", "twitter"], {
    required_error: "Please select a platform",
  }),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  profileUrl: z.string().url("Please enter a valid profile URL"),
  profileUsername: z.string().min(1, "Username is required"),
  followers: z.string().min(1, "Followers count is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Followers must be a positive number"),
  engagement: z.string().min(1, "Engagement rate is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, "Engagement must be between 0-100%"),
  monthlyViews: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly views must be a non-negative number"),
  monthlyRevenue: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly revenue must be a non-negative number"),
  accountAge: z.string().min(1, "Account age is required"),
  niche: z.string().min(1, "Niche is required"),
  isVerified: z.boolean().default(false),
  hasMonetization: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
  featured: z.boolean().default(false),
});

type SocialMediaForm = z.infer<typeof socialMediaSchema>;

interface SocialMediaFormProps {
  form: ReturnType<typeof useForm<SocialMediaForm>>;
  onSubmit: (data: SocialMediaForm) => void;
  isSubmitting: boolean;
  selectedCurrency: string;
}

/**
 * Social Media Form Component
 * 
 * Specialized form for social media assets with platform-specific fields
 * and validation for Instagram, YouTube, TikTok, and Twitter.
 */
export function SocialMediaForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  selectedCurrency 
}: SocialMediaFormProps) {
  const { getCurrencySymbol } = useCurrency();

  const getPlatformDescription = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'Instagram pages, accounts, and profiles with engaged followers';
      case 'youtube': return 'YouTube channels with subscribers, views, and monetization';
      case 'tiktok': return 'TikTok accounts with viral content and high engagement';
      case 'twitter': return 'Twitter accounts with followers and influence';
      default: return '';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return '📷';
      case 'youtube': return '📹';
      case 'tiktok': return '🎵';
      case 'twitter': return '🐦';
      default: return '💻';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getPlatformIcon(form.watch('platform') || 'instagram')}</span>
          Social Media Asset Details
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
                      <Input placeholder="e.g., Travel Photography Instagram Account" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear, descriptive title for your social media asset
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Media Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="instagram">📷 Instagram</SelectItem>
                        <SelectItem value="youtube">📹 YouTube</SelectItem>
                        <SelectItem value="tiktok">🎵 TikTok</SelectItem>
                        <SelectItem value="twitter">🐦 Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value && getPlatformDescription(field.value)}
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
                        placeholder="Describe your social media asset, its audience, content type, engagement, monetization potential, etc."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about your social media asset to attract buyers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ({getCurrencySymbol(selectedCurrency as Currency)})</FormLabel>
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
                      Set your asking price for the social media asset
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="profileUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Username</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., @travelphotography" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Age</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="profileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/yourpage" {...field} />
                    </FormControl>
                    <FormDescription>
                      Link to your social media profile for verification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="niche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Niche</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Travel Photography, Fitness, Cooking" {...field} />
                    </FormControl>
                    <FormDescription>
                      The main topic or category of your content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="followers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Followers/Subscribers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="engagement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engagement Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.0"
                          step="0.1"
                          min="0"
                          max="100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyViews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Views</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monthlyRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Revenue ({getCurrencySymbol(selectedCurrency as Currency)})</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Account Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Features</h3>
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="isVerified"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Verified Account</FormLabel>
                        <FormDescription>
                          Check if this is a verified account on the platform
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasMonetization"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Monetization Enabled</FormLabel>
                        <FormDescription>
                          Check if the account has monetization features enabled
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
                    <FormLabel>Profile Ownership Proof</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload a screenshot proving ownership of this profile
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
                      Screenshot showing you own this social media profile (required, max 2MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Listing..." : "Create Social Media Listing"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
