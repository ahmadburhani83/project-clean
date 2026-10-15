import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Memberikan fallback aman saat environment variables belum diset di Vercel/Local
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
