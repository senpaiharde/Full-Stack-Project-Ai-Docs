// app/api/uploadPdf/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export const config = { api: { bodyParser: false } };

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const userId = formData.get('userId') as string | null;
  if (!file || !userId) {
    return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${userId}/${file.name}`;

  const { error: uploadErr } = await getSupabaseServerClient.storage
    .from('pdfs')
    .upload(path, buffer, { contentType: file.type });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  const { data, error: insertErr } = await getSupabaseServerClient
    .from('pdf_files')
    .insert([{ filename: file.name, path, size_bytes: buffer.length }])
    .single();
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ row: data });
}
