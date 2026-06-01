"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2, Check } from "lucide-react";

interface BookCoverUploaderProps {
  currentCoverUrl?: string;
  onCoverUpload?: (newUrl: string) => void;
  onCoverRemove?: () => void;
}

export default function BookCoverUploader({
  currentCoverUrl,
  onCoverUpload,
  onCoverRemove
}: BookCoverUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync previewUrl dengan currentCoverUrl saat data buku di-load
  useEffect(() => {
    if (currentCoverUrl) {
      setPreviewUrl(currentCoverUrl);
    }
  }, [currentCoverUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Tampilkan preview instan
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadSuccess(false);

    // Simulasikan proses upload ke Docker Calibre
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      if (onCoverUpload) {
        onCoverUpload(objectUrl);
      }
      // Reset status sukses setelah beberapa detik
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1500);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setUploadSuccess(false);
    if (onCoverRemove) {
      onCoverRemove();
    }
  };

  return (
    <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit shadow-sm">
      <span className="text-sm font-semibold text-[#64748b] dark:text-zinc-400 mb-4 block">Book Cover</span>
      
      {/* Cover Preview Container */}
      <div className="w-full aspect-[3/4] bg-zinc-100 dark:bg-zinc-950 rounded-xl mb-4 overflow-hidden relative border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center group">
        {previewUrl ? (
          <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600">
            <Plus className="w-8 h-8 stroke-1" />
            <span className="text-xs font-medium">No Cover Image</span>
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 animate-in fade-in duration-200">
            <Loader2 className="w-8 h-8 animate-spin text-[#E5C39C]" />
            <span className="text-xs font-semibold tracking-wider">Uploading to Docker...</span>
          </div>
        )}

        {/* Success Overlay */}
        {uploadSuccess && (
          <div className="absolute inset-0 bg-emerald-500/95 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 animate-in fade-in duration-200">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-md scale-in duration-300">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="text-xs font-bold tracking-wider">Cover Synced!</span>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <Button 
        onClick={handleButtonClick}
        disabled={isUploading}
        variant="outline" 
        className="border-zinc-300 dark:border-zinc-700 h-16 rounded-xl flex flex-col items-center justify-center gap-1 mb-6 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[#1e293b] dark:text-zinc-300 cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span className="text-xs font-semibold">
          {previewUrl ? "Change Custom Cover" : "Add Custom Book Cover"}
        </span>
      </Button>

      {previewUrl && (
        <button 
          onClick={handleRemove}
          disabled={isUploading}
          className="text-[#D12B47] text-sm font-bold tracking-wide hover:opacity-70 transition-opacity w-full text-center cursor-pointer flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>REMOVE COVER</span>
        </button>
      )}
    </div>
  );
}
