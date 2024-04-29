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
  const [agreedMarketplace, setAgreedMarketplace] = useState<boolean>(false);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
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

  const createModel = api.model.trainModel.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSubmit = async () => {
    if (file) {
      // const formData = new FormData();
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

      createModel.mutate({ 
        modelName: index + "_" + Date.now(),
        inputUrl: newBlob.url,
        agreedMarketplace: agreedMarketplace,
        agreedTerms: agreedTerms
      });

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


      {/* Terms  Agreementn */}
      <div className="flex py-2 max-w-md">
        <div className="flex items-center h-5">
            <input 
              id="helper-checkbox" aria-describedby="helper-checkbox-text" type="checkbox" value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => setAgreedTerms(e.target.checked)}
            />
        </div>
        <div className="ms-2 text-sm">
            <label htmlFor="helper-checkbox" className="font-medium text-gray-900 dark:text-gray-300">I confirm that the uloaded images belong to me and I am a sole owner of them</label>
            {/* <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300"> </p> */}
        </div>
      </div>

      {/* Marketplace  Agreementn */}
      <div className="flex py-2 max-w-md">
        <div className="flex items-center h-5">
            <input 
              id="helper-checkbox" aria-describedby="helper-checkbox-text" type="checkbox" value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => setAgreedMarketplace(e.target.checked)}
            />
        </div>
        <div className="ms-2 text-sm">
            <label htmlFor="helper-checkbox" className="font-medium text-gray-900 dark:text-gray-300">Agree to publish my model on the Marketplace</label>
            <p id="helper-checkbox-text" className="text-xs font-normal text-gray-500 dark:text-gray-300"> I consent for this model to be published on the Marketplace and be publically available for discovery through our website. If not selected - the model will be available only through a custom link. </p>
        </div>
      </div>

      <button
        className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={handleSubmit}
        disabled={!agreedTerms}
      >
        Create a Model
      </button>

    </div>
  );
};

export default UploadFiles;