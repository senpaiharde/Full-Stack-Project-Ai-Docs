'use client';

import { createSupabaseClient } from '@/lib/superbase';
import { useAuth } from '@clerk/nextjs';
import { CircleArrowDown, RocketIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUploader() {
  const { userId, isLoaded } = useAuth();
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      if (!isLoaded || !userId) {
        console.error('Not signed in');
        return;
      }
      setUploading(true);

      for (const file of files) {
        const form = new FormData();
        form.append('userId', userId);
        form.append('file', file);

        const res = await fetch('/api/uploadPdf', {
          method: 'POST',
          body: form,
        });
        if (!res.ok) {
          console.error('Upload failed', await res.json());
        } else {
          const { row } = await res.json();
          console.log('Inserted PDF row via API:', row);
        }
      }

      setUploading(false);
    },
    [isLoaded, userId]
  );
  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': [],
    },
  });
  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed mt-10 w-[90%]  border-indigo-600 text-indigo-600
        rounded-lg h-96 flex items-center justify-center ${
          isFocused || isDragAccept ? 'border-indigo-300' : 'border-indigo-100'
        }`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p>Drop the files here ...</p>
            </>
          ) : (
            <>
              <CircleArrowDown className="h-20 w-20 animate-bounce" />
              <p>Drag n drop some files here, or click to select files</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
