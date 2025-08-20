# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your Product Data Scraper application.

## 🚨 Current Issue

Google sign-in and signup are not working because:
1. **Missing Supabase Configuration**
2. **Missing Environment Variables**
3. **Google OAuth Provider Not Configured**

## 📋 Prerequisites

1. **Supabase Account**: You need a Supabase account and project
2. **Google Cloud Console**: You need a Google Cloud project with OAuth 2.0 credentials
3. **Domain Verification**: Your domain needs to be verified for OAuth

## 🔧 Step-by-Step Setup

### 1. **Supabase Project Setup**

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### 2. **Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
7. Note down your Client ID and Client Secret

### 3. **Supabase OAuth Configuration**

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. Save the configuration

### 4. **Environment Variables**

Create a `.env` file in your `client` directory:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-key-here

# Optional: Google OAuth (if you want additional Google services)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 5. **Update Supabase Client Configuration**

Your `src/config/client.ts` should look like this:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:", {
    url: supabaseUrl,
    key: supabaseAnonKey ? "present" : "missing"
  });
  throw new Error("Missing Supabase environment variables. Please check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;
```

## 🧪 Testing the Setup

### 1. **Check Environment Variables**
```bash
# In your terminal, check if variables are loaded
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_KEY
```

### 2. **Test Supabase Connection**
```typescript
// In your browser console, test the connection
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('YOUR_URL', 'YOUR_KEY')
const { data, error } = await supabase.auth.getSession()
console.log('Connection test:', { data, error })
```

### 3. **Test Google OAuth**
1. Click the Google sign-in button
2. Check browser console for errors
3. Verify redirect to Google OAuth page
4. Check callback handling

## 🚨 Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"
**Solution**: Create `.env` file with correct variables

### Issue 2: "Invalid redirect URI"
**Solution**: Add your callback URL to Google OAuth credentials

### Issue 3: "OAuth provider not configured"
**Solution**: Enable Google provider in Supabase dashboard

### Issue 4: "CORS error"
**Solution**: Add your domain to Supabase allowed origins

### Issue 5: "Popup blocked"
**Solution**: Allow popups for your domain

## 🔍 Debugging Steps

### 1. **Check Console Errors**
Open browser console and look for:
- Environment variable errors
- Supabase connection errors
- OAuth redirect errors

### 2. **Verify Environment Variables**
```typescript
console.log('Environment check:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_KEY ? 'present' : 'missing'
});
```

### 3. **Test Supabase Client**
```typescript
try {
  const { data, error } = await supabase.auth.getSession();
  console.log('Supabase test:', { data, error });
} catch (err) {
  console.error('Supabase error:', err);
}
```

### 4. **Check Network Tab**
Look for:
- Failed requests to Supabase
- OAuth redirect issues
- CORS errors

## 📱 Alternative: Use Supabase Auth UI

If you continue having issues, consider using Supabase's pre-built auth UI:

```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

```typescript
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

<Auth
  supabaseClient={supabase}
  appearance={{ theme: ThemeSupa }}
  providers={['google']}
/>
```

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Google OAuth credentials configured
- [ ] Environment variables set
- [ ] Supabase Google provider enabled
- [ ] Redirect URIs configured
- [ ] OAuth flow tested
- [ ] Callback handling working
- [ ] User authentication successful

## 🆘 Getting Help

If you're still having issues:

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Supabase Discord**: Join the community for help
3. **Google Cloud Support**: For OAuth credential issues
4. **Browser Console**: Check for specific error messages

## 📝 Example .env File

```bash
# Copy this to .env and fill in your values
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNzQ5NjAwMCwiZXhwIjoxOTUzMDcyMDAwfQ.example
```

Remember to restart your development server after adding the `.env` file!
