import { useEffect, useState } from 'react';
import { createSupabaseClient } from '../superbase';

export function usePdfFiles() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    
    const supabase = createSupabaseClient();

    supabase
      .from('pdf_files')                 
      .select('*')
      .order('uploaded_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching PDFs:', error);
        } else {
          setFiles(data!);
        }
      });
  }, []);

  return files;
}
