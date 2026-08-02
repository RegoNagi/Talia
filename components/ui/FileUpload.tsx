import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

export const FileUpload = ({ text, file, onFileSelect }: { text: string, file: File | null, onFileSelect: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`w-full py-4 px-4 border border-dashed rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
          file ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-white hover:bg-slate-50'
        }`}
      >
        {file ? (
          <span className="text-sm font-medium text-green-700">{file.name}</span>
        ) : (
          <>
            <Upload className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-500 text-center">{text}</span>
          </>
        )}
      </div>
    </div>
  );
};
