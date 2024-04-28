"use client"
import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type FileWithPreview = { file: File, preview: string };

type UploadFilesProps = {
  index: string;
};

const UploadFiles: React.FC<UploadFilesProps> = ({ index }) => {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const dropAreaRef = useRef<HTMLDivElement>(null);

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
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const filesWithPreview = droppedFiles.map((file) => {
        const preview = URL.createObjectURL(file);
        return { file: file, preview: preview };
      });
      setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const filesWithPreview = selectedFiles.map((file) => {
        const preview = URL.createObjectURL(file);
        return { file: file, preview: preview };
      });
      setFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    }
  };

  const createModel = api.upload_files.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSubmit = async () => {
    if (files.length > 0) {
      // result = await api.uploadFiles.uploadFiles({ file: files[0] });

      const filesOnly = files.map((file) => file.file);
      console.log(filesOnly);
      createModel.mutate({ files: filesOnly});

      // const formData = new FormData();
      // files.forEach((file) => {
      //   formData.append('files', file);
      // });
      // formData.append('index-name', index);

      // const response = await fetch('/api/setup', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (response.status === 200) {
      //   console.log('Files uploaded successfully!');
      // } else {
      //   console.log('Error uploading files.');
      // }

      // files.forEach((file) => {
      //   URL.revokeObjectURL(file.preview);
      // });
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

      <div className="mt-4 grid grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-sm text-gray-600">{file.name}</span>
            <img src={file.preview} alt={file.name} className="h-32 object-cover" />
          </div>
        ))}
      </div>

      <button
        className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        onClick={handleSubmit}
      >
        Upload Files
      </button>

    </div>
  );
};

export default UploadFiles;