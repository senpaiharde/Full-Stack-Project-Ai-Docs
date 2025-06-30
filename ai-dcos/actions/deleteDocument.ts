'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import pineconeClient from '@/lib/pinecone';
import { indexName } from '@/lib/landchain';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function deleteDocument(docId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized'); // protect this route with clerk

  const supabase = getSupabaseServerClient;

  const { data: fileRecord, error: fetchErr } = await supabase
    .from('pdf_files')
    .select('path')
    .eq('id', docId)
    .eq('owner_id', userId)
    .single();

  if (fetchErr || !fileRecord) {
    console.error('Error fetching file record', fetchErr);
    throw new Error('Could not fetch file record');
  }





  
  const { error: dbErr } = await supabase
  .from('pdf_files');
  // Delete all embeddings associated with the document
  const index = await pineconeClient.index(indexName);
  await index.namespace(docId).deleteAll();

  // Revalidate the dashboard page to ensure the documents are up to date
  revalidatePath('/dashboard');
}
