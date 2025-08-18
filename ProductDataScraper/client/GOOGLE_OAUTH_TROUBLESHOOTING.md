# 🔐 Google OAuth Troubleshooting Guide

## 🚨 **Current Issues Identified:**

Based on your console logs, you're experiencing these specific problems:

### **1. Token Validation Failures**
```
❌ "No valid token found, attempting to refresh..."
❌ "No valid auth token available, cannot fetch profile"
❌ "Authentication token expired or invalid - please log in again"
```

### **2. Authentication State Mismatch**
```
✅ Supabase session found, restoring session
❌ Authentication state changes: {was: true, is: false}
```

### **3. Profile Fetch Errors**
```
❌ "Failed to fetch user profile: Error: Authentication token expired or invalid"
```

## 🔍 **Root Cause Analysis:**

### **Primary Issue: Supabase OAuth Provider Not Configured**
Your `.env` file is correctly set up, but Google OAuth provider is not enabled in Supabase.

### **Secondary Issue: Authentication Flow Conflict**
There's a conflict between Supabase session management and your custom token management system.

## 🛠️ **Step-by-Step Fix:**

### **Step 1: Enable Google OAuth in Supabase**

1. **Go to Supabase Dashboard:**
   - Visit [supabase.com](https://supabase.com)
   - Sign in to your account
   - Open project: `yyjbodjegiygudcjqyiw`

2. **Navigate to Authentication:**
   - Click **"Authentication"** in the left sidebar
   - Click **"Providers"** tab

3. **Enable Google Provider:**
   - Find **"Google"** in the list
   - Toggle the switch to **"Enabled"**
   - Click **"Configure"**

4. **Add Google OAuth Credentials:**
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
   - **Redirect URL**: `https://yyjbodjegiygudcjqyiw.supabase.co/auth/v1/callback`

### **Step 2: Configure Google Cloud Console**

1. **Go to Google Cloud Console:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Select your project

2. **OAuth 2.0 Credentials:**
   - Go to **"APIs & Services"** → **"Credentials"**
   - Find your OAuth 2.0 Client ID
   - Click **"Edit"**

3. **Add Authorized Redirect URIs:**
   ```
   https://yyjbodjegiygudcjqyiw.supabase.co/auth/v1/callback
   http://localhost:5173/auth/callback
   ```

### **Step 3: Test Your Configuration**

1. **Restart your development server**
2. **Go to Signup page**
3. **Click "Show OAuth Debug Tool"**
4. **Run tests in this order:**

   a. **🔍 Test Environment** - Should show ✅
   b. **🌐 Test Connection** - Should show ✅
   c. **Test Direct OAuth** - Should show ✅
   d. **Test OAuth (useAuth)** - Should show ✅

## 🧪 **Debug Tool Usage:**

### **Test 1: Environment Check**
- Verifies your `.env` file is loaded
- Should show both variables as "present"

### **Test 2: Connection Test**
- Tests basic Supabase connection
- Should connect without errors

### **Test 3: Direct OAuth Test**
- Tests Supabase OAuth directly
- Bypasses your custom hook
- Should initiate Google OAuth flow

### **Test 4: useAuth OAuth Test**
- Tests through your custom hook
- Should work if Direct OAuth works

### **Test 5: Auth Validation Test**
- Tests your authentication system
- Should work after OAuth is configured

## 🚨 **Common Error Messages & Solutions:**

### **Error: "OAuth provider not configured"**
**Solution:** Enable Google provider in Supabase dashboard

### **Error: "Invalid redirect URI"**
**Solution:** Add callback URLs to Google OAuth credentials

### **Error: "Provider disabled"**
**Solution:** Check if Google provider is enabled in Supabase

### **Error: "Network error"**
**Solution:** Check internet connection and Supabase status

### **Error: "Popup blocked"**
**Solution:** Allow popups for your domain

## 📋 **Verification Checklist:**

- [ ] Google OAuth provider enabled in Supabase
- [ ] Google OAuth credentials configured in Supabase
- [ ] Redirect URIs added to Google Cloud Console
- [ ] Development server restarted
- [ ] Environment variables loaded (check console)
- [ ] Supabase connection successful
- [ ] Direct OAuth test passes
- [ ] useAuth OAuth test passes
- [ ] Google sign-in button works
- [ ] OAuth callback handled correctly

## 🔍 **Console Log Analysis:**

### **✅ Good Signs:**
```
✅ Supabase configured successfully
✅ Supabase connection test successful
✅ OAuth configuration test successful
```

### **❌ Problem Signs:**
```
❌ Supabase Configuration Error
❌ Supabase connection test failed
❌ OAuth configuration test failed
❌ Provider not configured
❌ Invalid redirect URI
```

## 🆘 **If Still Not Working:**

### **1. Check Supabase Status:**
- Visit [status.supabase.com](https://status.supabase.com)
- Ensure no service outages

### **2. Verify OAuth Configuration:**
- Double-check Google OAuth credentials
- Ensure redirect URIs match exactly

### **3. Check Browser Console:**
- Look for specific error messages
- Check network tab for failed requests

### **4. Test with Simple Example:**
```typescript
// Test in browser console
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('YOUR_URL', 'YOUR_KEY')
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: 'http://localhost:5173/auth/callback' }
})
console.log('OAuth test:', { data, error })
```

## 📞 **Getting Help:**

1. **Supabase Discord**: Join community for help
2. **Google Cloud Support**: For OAuth credential issues
3. **Check Documentation**: [supabase.com/docs](https://supabase.com/docs)
4. **Browser Console**: Look for specific error messages

## 🎯 **Expected Result:**

After following these steps, you should see:
- ✅ All debug tests pass
- ✅ Google sign-in button works
- ✅ Redirects to Google OAuth page
- ✅ Successful authentication
- ✅ User profile loaded correctly
- ✅ No more token validation errors

**Remember: The key is enabling the Google OAuth provider in your Supabase dashboard!**

