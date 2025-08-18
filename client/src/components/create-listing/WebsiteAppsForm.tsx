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
import { Upload, Globe, Smartphone, Code, DollarSign, Users, TrendingUp } from "lucide-react";
import { Currency } from "@/lib/store/walletStore";
import { formatFileSize, isValidFileSize } from "@/lib/utils";

const websiteAppsSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  assetType: z.enum(["website", "webapp", "mobile-app", "desktop-app"], {
    required_error: "Please select an asset type",
  }),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  domainName: z.string().optional(),
  monthlyVisitors: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly visitors must be a non-negative number"),
  monthlyRevenue: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), "Monthly revenue must be a non-negative number"),
  technology: z.string().optional(),
  platform: z.string().optional(),
  hasMonetization: z.boolean().default(false),
  hasAds: z.boolean().default(false),
  hasSubscription: z.boolean().default(false),
  hasEcommerce: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
  featured: z.boolean().default(false),
});

type WebsiteAppsForm = z.infer<typeof websiteAppsSchema>;

interface WebsiteAppsFormProps {
  form: ReturnType<typeof useForm<WebsiteAppsForm>>;
  onSubmit: (data: WebsiteAppsForm) => void;
  isSubmitting: boolean;
  selectedCurrency: string;
}

/**
 * Website and Apps Form Component
 * 
 * Specialized form for website and application assets with
 * platform-specific fields and validation.
 */
export function WebsiteAppsForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  selectedCurrency 
}: WebsiteAppsFormProps) {
  const { getCurrencySymbol } = useCurrency();

  const getAssetTypeDescription = (assetType: string) => {
    switch (assetType) {
      case 'website': return 'Websites, blogs, and web properties';
      case 'webapp': return 'Web applications and SaaS platforms';
      case 'mobile-app': return 'Mobile applications for iOS and Android';
      case 'desktop-app': return 'Desktop applications and software';
      default: return '';
    }
  };

  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType) {
      case 'website': return '🌐';
      case 'webapp': return '💻';
      case 'mobile-app': return '📱';
      case 'desktop-app': return '🖥️';
      default: return '💻';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getAssetTypeIcon(form.watch('assetType') || 'website')}</span>
          Website & Apps Asset Details
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
                      <Input placeholder="e.g., E-commerce Website with 10K Monthly Visitors" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear, descriptive title for your website or app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">🌐 Website</SelectItem>
                        <SelectItem value="webapp">💻 Web Application</SelectItem>
                        <SelectItem value="mobile-app">📱 Mobile App</SelectItem>
                        <SelectItem value="desktop-app">🖥️ Desktop App</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value && getAssetTypeDescription(field.value)}
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
                        placeholder="Describe your website or app, its features, target audience, monetization methods, etc."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed information about your asset to attract buyers
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
                      Set your asking price for the website or app
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Asset Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Asset Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website/App URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Link to your website or app (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., yourwebsite.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Domain name if applicable
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="technology"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology Stack</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Node.js, MongoDB" {...field} />
                      </FormControl>
                      <FormDescription>
                        Technologies used to build the asset
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
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., iOS, Android, Web, Windows" {...field} />
                      </FormControl>
                      <FormDescription>
                        Platform(s) the asset runs on
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="monthlyVisitors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Visitors/Users</FormLabel>
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

            {/* Monetization Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Monetization Features</h3>
              
              <div className="space-y-3">
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
                          Check if the asset has monetization features
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasAds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Advertising Revenue</FormLabel>
                        <FormDescription>
                          Check if the asset generates revenue through ads
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasSubscription"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Subscription Model</FormLabel>
                        <FormDescription>
                          Check if the asset uses a subscription-based model
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasEcommerce"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>E-commerce Features</FormLabel>
                        <FormDescription>
                          Check if the asset has e-commerce capabilities
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
                    <FormLabel>Ownership Proof Screenshot</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload a screenshot proving ownership of this asset
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
                      Screenshot showing you own this website or app (required, max 2MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Listing..." : "Create Website/App Listing"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
