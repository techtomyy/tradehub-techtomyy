import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Enhanced error logging for debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 Supabase Configuration Error:", {
    url: supabaseUrl ? "✅ Present" : "❌ Missing",
    key: supabaseAnonKey ? "✅ Present" : "❌ Missing",
    envVars: {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY ? "present" : "missing"
    }
  });
  
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file.\n" +
    "Required variables:\n" +
    "- VITE_SUPABASE_URL\n" +
    "- VITE_SUPABASE_KEY\n" +
    "\nSee GOOGLE_OAUTH_SETUP.md for setup instructions."
  );
}

// Log successful configuration
console.log("✅ Supabase configured successfully:", {
  url: supabaseUrl,
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : "missing"
});

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true, // Enable debug mode for OAuth
    onAuthStateChange: (event, session) => {
      console.log("🔐 Supabase Auth State Change:", { event, session: session ? "present" : "none" });
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'product-data-scraper'
    }
  }
});

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("❌ Supabase connection test failed:", error);
  } else {
    console.log("✅ Supabase connection test successful:", {
      hasSession: !!data.session,
      user: data.session?.user?.email || "none"
    });
  }
}).catch(err => {
  console.error("❌ Supabase connection test error:", err);
});

// Test OAuth configuration
const testOAuthConfig = async () => {
  try {
    console.log("🔍 Testing OAuth configuration...");
    
    // Test if we can access auth methods
    const { data: { providers } } = await supabase.auth.listIdentities();
    console.log("✅ OAuth providers available:", providers);
    
    // Test OAuth URL generation
    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (oauthError) {
      console.error("❌ OAuth configuration test failed:", oauthError);
      return false;
    } else {
      console.log("✅ OAuth configuration test successful:", oauthData);
      return true;
    }
  } catch (error) {
    console.error("❌ OAuth configuration test error:", error);
    return false;
  }
};

// Run OAuth test after a delay to ensure client is ready
setTimeout(() => {
  testOAuthConfig();
}, 1000);

export default supabase;
