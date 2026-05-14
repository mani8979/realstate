'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface FileDropzoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  uploading?: boolean;
  multiple?: boolean;
  accept?: string;
  children?: React.ReactNode;
  className?: string;
  label?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  uploading = false,
  multiple = false,
  accept = "*",
  children,
  className = "",
  label = "Drag & Drop to Upload"
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set to false if we actually left the container, not just entered a child
    const rect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (
      clientX <= rect.left ||
      clientX >= rect.right ||
      clientY <= rect.top ||
      clientY >= rect.bottom
    ) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  }, [isDragActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setJustDropped(true);
    
    // Reset the "just dropped" flag after a short delay to allow click event to pass
    setTimeout(() => setJustDropped(false), 100);

    if (uploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // CRITICAL: Convert FileList to Array immediately because browsers clear 
      // FileList after the event handler finishes, which breaks async loops.
      const filesArray = Array.from(files);
      if (!multiple && filesArray.length > 1) {
        onFilesSelected([filesArray[0]]);
      } else {
        onFilesSelected(filesArray);
      }
    }
  }, [multiple, onFilesSelected, uploading]);

  const handleClick = (e: React.MouseEvent) => {
    // If this was a click immediately after a drop, ignore it
    if (justDropped) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = accept;
    input.onchange = (e: any) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        // Also convert to array here for consistency
        onFilesSelected(Array.from(files));
      }
    };
    input.click();
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative cursor-pointer transition-all duration-300
        ${isDragActive ? 'border-primary bg-primary/10 scale-[1.02] shadow-xl' : ''}
        ${uploading ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isDragActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-primary/20 backdrop-blur-sm rounded-[inherit] border-2 border-dashed border-primary animate-in fade-in duration-200 pointer-events-none">
          <div className="bg-primary text-black p-4 rounded-full shadow-2xl animate-bounce">
            <Upload size={32} strokeWidth={3} />
          </div>
          <p className="mt-4 text-primary font-black uppercase tracking-widest text-sm drop-shadow-md">
            Drop to Upload
          </p>
        </div>
      )}

      {children ? children : (
        <div className="flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl hover:border-primary transition-colors group">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 group-hover:bg-primary group-hover:text-black transition-all">
            {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              {uploading ? 'Uploading...' : label}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {multiple ? 'Support for multiple files' : 'Single file upload'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
