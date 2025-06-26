import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

async function ChatToFilePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const { data, error } = await getSupabaseServerClient
    .from('pdf_files')
    .select('path')
    .eq('id', id)
    .eq('owner_id', userId)
    .single();

  if (error || !data?.path) {
    console.error(error);
    throw new Error('Could not fetch PDF file path from Supabase.');
  }
  const path = data?.path;
  const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/pdfs/${path}`;
  console.log(`--- Public download URL: ${url} ---`);

  const respone = await fetch(url);
  return (
    <div className="grid lg:grid-cols-5 h-full overflow-hidden">
      <div></div>
      <div></div>
    </div>
  );
}

export default ChatToFilePage;
