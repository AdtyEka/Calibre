"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveModal({ isOpen, onClose, onConfirm }: RemoveModalProps) {
  const [showWarningAgain, setShowWarningAgain] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs">
      <div className="bg-[#f8fafc] dark:bg-zinc-950 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-2">
          <h2 className="text-3xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">
            Are You Sure?
          </h2>
        </div>

        {/* Modal Content - White card container */}
        <div className="px-6 pb-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl p-6 shadow-xs flex flex-col gap-6">
            {/* Warning Message Row */}
            <div className="flex items-start gap-4">
              {/* Custom High-Fidelity Alert Triangle Graphic */}
              <div className="relative w-14 h-14 flex-shrink-0 flex items-center justify-center">
                <svg 
                  className="w-full h-full text-[#d9264c] fill-current" 
                  viewBox="0 0 24 24" 
                  strokeLinejoin="round" 
                  strokeLinecap="round"
                >
                  <path d="M12 3L2 21h20L12 3z" />
                </svg>
                <span className="absolute text-white font-black text-2xl pb-1 font-sans select-none">!</span>
              </div>

              {/* Warning Text */}
              <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium pt-1">
                The selected book will be <strong className="text-zinc-800 dark:text-white font-bold">deleted</strong> and the files removed from your calibre library.
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              {/* Checkbox (pre-checked) */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-zinc-500 hover:text-zinc-700 transition-colors">
                <input 
                  type="checkbox" 
                  checked={showWarningAgain} 
                  onChange={(e) => setShowWarningAgain(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-[#1c2e3d] focus:ring-[#1c2e3d] w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                  Show this warning again
                </span>
              </label>

              {/* Buttons (No & Yes) */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  onClick={onClose}
                  className="bg-[#1b2e3c] hover:bg-[#13212c] text-white px-5 py-2.5 rounded-lg font-bold shadow-none text-sm transition-colors cursor-pointer flex items-center gap-1.5 w-full sm:w-auto"
                >
                  <X className="w-4 h-4 text-white" />
                  No
                </Button>
                <Button 
                  onClick={() => {
                    onConfirm();
                  }}
                  className="bg-[#d9264c] hover:bg-[#b51d3b] text-white px-5 py-2.5 rounded-lg font-bold shadow-none text-sm transition-colors cursor-pointer flex items-center gap-1.5 w-full sm:w-auto"
                >
                  <Check className="w-4 h-4 text-white" />
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
