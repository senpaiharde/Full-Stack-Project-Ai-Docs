'use client';
import { useState } from 'react';
import { createSupabaseClient } from '../lib/superbase';

export default function PdfUpload() {
  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return;

    const supabase = createSupabaseClient();

    //  Fetch the authenticated user correctly
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      console.error('No user session:', userErr);
      return;
    }

    const path = `${user.id}/${file.name}`;

    //  Upload to storage
    const { error: uploadErr } = await supabase.storage
      .from('pdfs')
      .upload(path, file);
    if (uploadErr) {
      console.error('Storage upload error:', uploadErr);
      return;
    }

    //  Insert metadata row
    const { data, error: insertErr } = await supabase
      .from('pdf_files')
      .insert([
        {
          filename: file.name,
          path,
          size_bytes: file.size,
        },
      ]);
    if (insertErr) {
      console.error('Insert metadata error:', insertErr);
      return;
    }

    console.log('Inserted PDF row:', data);
  };

  return (
    <>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files![0])}
      />
      <button onClick={upload}>Upload PDF</button>
    </>
  );
}
