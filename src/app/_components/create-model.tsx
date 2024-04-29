"use client"
import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

import type { PutBlobResult } from '@vercel/blob';


type FileWithPreview = { file: File, preview: string };

type UploadFilesProps = {
  index: string;
};

const UploadFiles: React.FC<UploadFilesProps> = ({ index }) => {
  const router = useRouter();
  const [file, setFile] = useState<File | undefined>(undefined);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('bg-gray-200');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-gray-200');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('bg-gray-200');
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const zipFile = e.dataTransfer.files[0];
      setFile(zipFile);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const createModel = api.upload_files.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      //formData.append('file', file);
      //formData.append('index', index);

      const response = await fetch(
        `/api/upload?filename=${file.name}`,
        {
          method: 'POST',
          body: file,
        },
      );

      const newBlob = (await response.json()) as PutBlobResult;

      setBlob(newBlob);

    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={dropAreaRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="w-full max-w-md border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition-colors duration-300"
      >
        <input
          type="file"
          id=""
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        <p className="font-semibold text-gray-600">
          Drag and drop images here or click to select files
        </p>
      </div>

      {file && (
        <div className="mt-4">
          <span className="text-sm">Ready to upload:</span> <span className="text-sm text-gray-600">{file.name}</span>
        </div>
      )}

      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}

      <button
        className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={handleSubmit}
      >
        Upload Zip File
      </button>

    </div>
  );
};

export default UploadFiles;