import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Mendukung pengaturan manual via panel admin (disimpan di browser jika Vercel env belum diset)
  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem("custom_supabase_url");
    const customKey = localStorage.getItem("custom_supabase_key");
    if (customUrl && customUrl.trim()) supabaseUrl = customUrl.trim();
    if (customKey && customKey.trim()) supabaseAnonKey = customKey.trim();
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
