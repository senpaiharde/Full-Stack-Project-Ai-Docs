import React from 'react';
import PlaceHolderDocument from './PlaceHolderDocument';
import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { auth } from '@clerk/nextjs/server';
import Document from './Document';
interface FileRecord {
  id: string;
  name: string;
  downloadUrl: string;
  size: number;
}
async function Documents() {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');
  const supabase = getSupabaseServerClient;

  
  const { data: rows, error } = await supabase
    .from('pdf_files')
    .select('id, path')
    .eq('owner_id', userId);

  if (error) {
    console.error('Supabase fetch error', error);
    throw new Error('Could not fetch PDF records');
  }

  // 2) for each file, compute publicUrl + size metadata
  const files: FileRecord[] = await Promise.all(
    rows.map(async ({ id, path }) => {
      const fileName = path.split('/').pop()!;
      const folderPrefix = path.slice(0, path.lastIndexOf('/') + 1);

      // public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from('pdfs') 
        .getPublicUrl(path);

      
      const { data: listedFiles, error: listError } = await supabase.storage
        .from('pdfs')
        .list(folderPrefix);

      if (listError) {
        console.warn('List error for', path, listError);
      }

      const thisFile = listedFiles?.find((f) => f.name === fileName);
      const size = thisFile?.metadata.size ?? 0;

      return {
        id,
        name: fileName,
        downloadUrl: publicUrl,
        size,
      };
    })
  );
  console.log(files,'files')

  return (
    <div
      className=" flex flex-wrap p-5 bg-gray-100  dark:bg-zinc-900 justify-center 
    lg:justify-start rounded-b-sm gap-5 max-w-7xl mx-auto">
        {files.map(({ id, name, downloadUrl, size }) => (
        <Document
          key={id}
          id={id}
          name={name}
          size={size}
          downloadUrl={downloadUrl}
        />
      ))}
      <PlaceHolderDocument />
    </div>
  );
}

export default Documents;
