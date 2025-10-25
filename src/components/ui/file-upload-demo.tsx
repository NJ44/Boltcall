"use client";
import { useState } from "react";
import { FileUpload } from "./file-upload";

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (newFiles: File[]) => {
    setFiles(newFiles);
    console.log('Files uploaded:', newFiles);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-background border-neutral-200 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
      {files.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {files.length} file(s) uploaded successfully
          </p>
        </div>
      )}
    </div>
  );
}
