import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file_id = searchParams.get('file_id');

  if (!file_id) {
    return NextResponse.json({ error: 'Missing file_id' }, { status: 400 });
  }

  const { data, error } = await getSupabaseServerClient
    .from('chat_messages')
    .select('*')
    .eq('file_id', file_id)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
