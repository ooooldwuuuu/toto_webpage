/**
 * Whether real Supabase credentials are present. During early static-page
 * development this is `false`, and the app falls back to built-in mock data
 * (see `src/lib/mock-data.ts`) so the storefront renders without a database.
 * Wiring Supabase is the final step — just fill in `.env.local`.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
