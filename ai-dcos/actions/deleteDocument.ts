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
    .from('pdf_files')
    .delete()
    .eq('id', docId)
    .eq('owner_id', userId);
  if (dbErr) {
    console.error('Error deleting database record', dbErr);
    throw new Error('Could deleting database record');
  }

  const { error: storageErr } = await supabase.storage.from('pdfs').remove([fileRecord.path]);

  if (storageErr) {
    console.error('Error deleting from storage', storageErr);
    throw new Error('Error deleting from storaged');
  }

  // Delete all embeddings associated with the document
  try {
    const index = pineconeClient.index(indexName);
    await index.namespace(docId).deleteAll();
  } catch (err: any) {
    // Ignore 404 when namespace does not exist
    if (err.statusCode === 404) {
      console.warn(`Pinecone namespace '${docId}' not found, skipping embeddings deletion.`);
    } else {
      console.error('Error deleting Pinecone namespace', err);
      throw err;
    }
  }
  // Revalidate the dashboard page to ensure the documents are up to date
  revalidatePath('/dashboard');
}
