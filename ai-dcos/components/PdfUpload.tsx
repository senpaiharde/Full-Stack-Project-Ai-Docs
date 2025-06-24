
'use client';
import { useState } from 'react';
import { createSupabaseClient } from '../lib/superbase';

export default function PdfUpload() {
  const [file, setFile] = useState<File | null>(null);
  const upload = async () => {
    if (!file) return;
     const supabase = createSupabaseClient();
    const user = supabase.auth.user();
    const path = `${user!.id}/${file.name}`;
    // Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from('pdfs')
      .upload(path, file);
    if (uploadErr) return console.error(uploadErr);
    // Insert metadata
    const { data, error: insertErr } = await supabase
      .from('pdf_files')
      .insert([{ filename: file.name, path, size_bytes: file.size }]);
    if (insertErr) return console.error(insertErr);
    console.log('Inserted PDF row:', data);
  };
  return (
    <>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files![0])} />
      <button onClick={upload}>Upload PDF</button>
    </>
  );
}
