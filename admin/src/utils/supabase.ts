import { createClient } from "@supabase/supabase-js";
import config from "../../config";

export default createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);
