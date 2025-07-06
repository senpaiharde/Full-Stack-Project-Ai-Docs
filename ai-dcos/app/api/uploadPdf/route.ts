import { NextResponse } from 'next/server';

import { getSupabaseServerClient } from '@/lib/supabaseServer';

export const config = { api: { bodyParser: false } };

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('userId') as string | null;
  if (!file || !userId) {
    return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
  }
  const buffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(buffer);
  const path = `${userId}/${file.name}`;

  const { error: uploadErr } = await getSupabaseServerClient.storage
    .from('pdfs')
    .upload(path, uint8, { contentType: file.type });
  console.log(' uploadErr:', uploadErr);
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const insertResult = await getSupabaseServerClient
    .from('pdf_files')
    .insert([
      {
        owner_id: userId,
        filename: file.name,
        path,
        size_bytes: uint8.length,
      },
    ])
    .select('*')
    .single();

  console.log(' insertResult:', insertResult);
  if (insertResult.error) {
    return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
  }
  const row = insertResult.data;

  return NextResponse.json({ row }, { status: 200 });
}
