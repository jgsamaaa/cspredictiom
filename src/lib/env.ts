export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const pandaScoreToken = process.env.PANDASCORE_TOKEN ?? "";

export const openAiApiKey = process.env.OPENAI_API_KEY ?? "";
export const openAiModel = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

export const appOrigin =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
