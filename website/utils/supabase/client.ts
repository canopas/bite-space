import { createBrowserClient } from "@supabase/ssr";
import config from "@/config";

export const createClient = () =>
  createBrowserClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
