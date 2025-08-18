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
import { Upload, Mail, Key, Shield, Star, Calendar } from "lucide-react";
import { Currency } from "@/lib/store/walletStore";
import { formatFileSize, isValidFileSize } from "@/lib/utils";

const otherAssetsSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  assetType: z.enum(["email", "gaming-account", "crypto-wallet", "domain", "software-license", "other"], {
    required_error: "Please select an asset type",
  }),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  assetName: z.string().min(1, "Asset name is required"),
  accountAge: z.string().optional(),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]).optional(),
  hasTwoFactor: z.boolean().default(false),
  hasRecoveryEmail: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  hasSpecialFeatures: z.boolean().default(false),
  assetProofImage: z.instanceof(File, { message: "Asset proof screenshot is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "File size must be less than 2MB"),
  featured: z.boolean().default(false),
});

type OtherAssetsForm = z.infer<typeof otherAssetsSchema>;

interface OtherAssetsFormProps {
  form: ReturnType<typeof useForm<OtherAssetsForm>>;
  onSubmit: (data: OtherAssetsForm) => void;
  isSubmitting: boolean;
  selectedCurrency: string;
}

/**
 * Other Assets Form Component
 * 
 * Specialized form for other digital assets like email accounts,
 * gaming accounts, crypto wallets, domains, etc.
 */
export function OtherAssetsForm({ 
  form, 
  onSubmit, 
  isSubmitting, 
  selectedCurrency 
}: OtherAssetsFormProps) {
  const { getCurrencySymbol } = useCurrency();

  const getAssetTypeDescription = (assetType: string) => {
    switch (assetType) {
      case 'email': return 'Email accounts with specific usernames or domains';
      case 'gaming-account': return 'Gaming accounts with rare items or high levels';
      case 'crypto-wallet': return 'Cryptocurrency wallets with specific addresses';
      case 'domain': return 'Domain names and web addresses';
      case 'software-license': return 'Software licenses and activation keys';
      case 'other': return 'Other unique digital assets';
      default: return '';
    }
  };

  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType) {
      case 'email': return '📧';
      case 'gaming-account': return '🎮';
      case 'crypto-wallet': return '₿';
      case 'domain': return '🌐';
      case 'software-license': return '🔑';
      case 'other': return '💎';
      default: return '💎';
    }
  };

  const getRarityDescription = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Common asset, easily available';
      case 'uncommon': return 'Uncommon asset, moderately rare';
      case 'rare': return 'Rare asset, hard to find';
      case 'epic': return 'Epic asset, very rare and valuable';
      case 'legendary': return 'Legendary asset, extremely rare and valuable';
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getAssetTypeIcon(form.watch('assetType') || 'other')}</span>
          Other Digital Asset Details
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
                      <Input placeholder="e.g., Rare Gaming Account with Legendary Items" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a clear, descriptive title for your digital asset
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
                        <SelectItem value="email">📧 Email Account</SelectItem>
                        <SelectItem value="gaming-account">🎮 Gaming Account</SelectItem>
                        <SelectItem value="crypto-wallet">₿ Crypto Wallet</SelectItem>
                        <SelectItem value="domain">🌐 Domain Name</SelectItem>
                        <SelectItem value="software-license">🔑 Software License</SelectItem>
                        <SelectItem value="other">💎 Other Asset</SelectItem>
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
                name="assetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name/Identifier</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., username@domain.com, gamertag, wallet address" {...field} />
                    </FormControl>
                    <FormDescription>
                      The specific name, username, or identifier of your asset
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
                        placeholder="Describe your digital asset, its features, rarity, value, etc."
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
                      Set your asking price for the digital asset
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
                  name="accountAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Age (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3 years" {...field} />
                      </FormControl>
                      <FormDescription>
                        How long the account has existed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rarity Level (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rarity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="common">Common</SelectItem>
                          <SelectItem value="uncommon">Uncommon</SelectItem>
                          <SelectItem value="rare">Rare</SelectItem>
                          <SelectItem value="epic">Epic</SelectItem>
                          <SelectItem value="legendary">Legendary</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value && getRarityDescription(field.value)}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Security Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Security Features</h3>
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="hasTwoFactor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Two-Factor Authentication</FormLabel>
                        <FormDescription>
                          Check if the account has 2FA enabled
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasRecoveryEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Recovery Email</FormLabel>
                        <FormDescription>
                          Check if the account has a recovery email set up
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

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
                          Check if this is a verified account
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasSpecialFeatures"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Special Features</FormLabel>
                        <FormDescription>
                          Check if the asset has unique or special features
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
                      Screenshot showing you own this digital asset (required, max 2MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Listing..." : "Create Other Asset Listing"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
