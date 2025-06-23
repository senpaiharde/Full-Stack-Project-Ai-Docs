'use client';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
function FileUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } = useDropzone({
    onDrop,
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
        <div className="">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
