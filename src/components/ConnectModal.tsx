"use client";

import { useState } from "react";
import { FolderOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [folderPath, setFolderPath] = useState("Six of Crows");
  const [email, setEmail] = useState("JohnDoe@mail.com");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs">
      <div className="bg-[#f8fafc] dark:bg-zinc-950 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-[#f8fafc] dark:bg-zinc-950 rounded-t-2xl border-b border-zinc-100 dark:border-zinc-800/50">
          <h2 className="text-3xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Connect</h2>
          <div className="flex items-center gap-6">
            <button 
              onClick={onClose} 
              className="text-[#1e293b] dark:text-zinc-300 font-semibold hover:opacity-70 transition-opacity text-sm cursor-pointer"
            >
              Cancel
            </button>
            <Button 
              onClick={() => {
                alert(`Folder path "${folderPath}" and email "${email}" submitted successfully!`);
                onClose();
              }}
              className="bg-[#1b2e3c] hover:bg-[#13212c] text-white px-6 py-2.5 rounded-lg font-bold shadow-none text-sm transition-colors cursor-pointer"
            >
              Send
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Connect to Folder Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-[#EAEFF5] dark:bg-zinc-800/80 flex items-center justify-center text-[#1b2e3c] dark:text-[#E5C39C]">
                <FolderOpen className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-bold text-lg">Connect to Folder</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Path to Folder
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={folderPath} 
                  onChange={(e) => setFolderPath(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-800 dark:text-zinc-200 font-medium focus:outline-hidden pr-10 focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors" 
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">
                  <FolderOpen className="w-4 h-4 fill-current" />
                </div>
              </div>
            </div>
          </div>

          {/* Email to Section */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-[#EAEFF5] dark:bg-zinc-800/80 flex items-center justify-center text-[#1b2e3c] dark:text-[#E5C39C]">
                <Mail className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-bold text-lg">Email to</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Insert Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-800 dark:text-zinc-200 font-medium focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
