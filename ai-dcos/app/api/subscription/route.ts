import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient;

  const { data: sub, error: subErr } = await supabase
    .from('subscriptions') //table
    .select('is_pro') // col
    .eq('user_id', userId) // having
    .order('created_at', { ascending: false }) // taking the bottom turning of the first
    .limit(1); // limitter

  if (subErr) throw subErr;

  const { count, error: countErr } = await supabase
    .from('pdf_files')
    .select('id', { head: true, count: 'exact' })
    .eq('owner_id', userId);

  if (countErr) throw countErr;

  return NextResponse.json({
    hasActiveMembership: sub.is_pro,
    fileCount: count ?? 0,
  });
}
