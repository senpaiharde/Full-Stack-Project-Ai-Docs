import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const { getToken } = await auth();
  const token = await getToken({ template: 'supabase' });

  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
}
