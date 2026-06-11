export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const pandaScoreToken = process.env.PANDASCORE_TOKEN ?? "";

export const appOrigin =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
