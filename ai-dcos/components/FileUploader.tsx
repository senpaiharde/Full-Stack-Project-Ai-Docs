'use client';

import { createSupabaseClient } from '@/lib/superbase';
import { useAuth } from '@clerk/nextjs';
import { CircleArrowDown, RocketIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUploader() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const simulateProgress = () => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 5;
      setProgress(current > 100 ? 100 : current);
      setStatus(`Uploading... ${current > 100 ? 100 : current}%`);

      if (current >= 100) clearInterval(interval);
    }, 150);
  };
  const onDrop = useCallback(
    async (files: File[]) => {
      if (!isLoaded || !userId) {
        console.error('Not signed in');
        return;
      }
      setUploading(true);
      setProgress(0);
      setStatus('Starting upload...');
      simulateProgress();
      for (const file of files) {
        const form = new FormData();
        form.append('userId', userId);
        form.append('file', file);

        const res = await fetch('/api/uploadPdf', {
          method: 'POST',
          body: form,
        });
        const json = await res.json();
        console.log(' uploadPdf response', json);
        if (json.error) {
          console.error('Upload API error:', json.error);
          setStatus('Upload failed');
          setUploading(false);
          return;
        }
        const row = json.row;
        setProgress(100);
        setStatus('Upload complete!');
        //console.log(' Inserted PDF row via API:', row);
        router.push(`/dashboard/files/${row.id}`);
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
      {uploading && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4
                ${progress === 100 && 'hidden'}`}
            role="progressbar"
            style={{
              //@ts-ignore
              '--value': progress,
              '--size': '12rem',
              '--thickness': '1.3rem',
            }}>
            {progress}%
          </div>
          <p>{status}</p>
        </div>
      )}
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
