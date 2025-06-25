
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const URL   = process.env.SUPABASE_URL!;
const ADMIN = process.env.SUPABASE_SERVICE_ROLE_KEY!;





export const getSupabaseServerClient: SupabaseClient = createClient(URL, ADMIN);
