"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  X, 
  RefreshCw, 
  Check, 
  Cloud, 
  Trash2, 
  Database,
  ArrowRight,
  Sparkles,
  Download,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
  // 1. Library State
  const [defaultFormat, setDefaultFormat] = useState("EPUB (Modern)");
  const [libraryPath, setLibraryPath] = useState("/Volumes/Archive/Calibre_Main");
  const [interfaceLanguage, setInterfaceLanguage] = useState("English (Oxford)");

  // 2. Advanced / Metadata Source Priority State
  const [priorityList, setPriorityList] = useState([
    "Google Books",
    "Open Library",
    "Amazon (Global)",
    "ManyBooks",
    "Nexto"
  ]);
  const [conversionEngine, setConversionEngine] = useState("Calibre Core 7.0");
  const [heuristicProcessing, setHeuristicProcessing] = useState(false);

  // 3. Sync State
  const [dropboxConnected, setDropboxConnected] = useState(true);
  const [gdriveConnected, setGdriveConnected] = useState(false);
  const [isGdriveConnecting, setIsGdriveConnecting] = useState(false);

  // 4. Danger Zone Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Handlers for Metadata tag deletion
  const handleRemovePriority = (source: string) => {
    setPriorityList(prev => prev.filter(item => item !== source));
  };

  const handleResetPriority = () => {
    setPriorityList(["Google Books", "Open Library", "Amazon (Global)", "ManyBooks", "Nexto"]);
  };

  // Simulated Google Drive Connection
  const handleGdriveConnect = () => {
    setIsGdriveConnecting(true);
    setTimeout(() => {
      setIsGdriveConnecting(false);
      setGdriveConnected(true);
    }, 1500);
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-8 w-full pb-24 relative">
      {/* Main settings layout grid */}
      <div className="flex flex-col gap-6">
        
        {/* Top row: Library and Advanced side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Library (5 cols) */}
          <Card className="md:col-span-5 p-6 border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-none rounded-2xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 mb-6">Library</h2>
              
              <div className="flex flex-col gap-5">
                {/* Default Format */}
                <div>
                  <label className="text-xs text-zinc-800 dark:text-zinc-300 font-bold mb-1.5 block">Default Format</label>
                  <div className="relative">
                    <select
                      value={defaultFormat}
                      onChange={(e) => setDefaultFormat(e.target.value)}
                      className="w-full h-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-xs font-semibold px-3 pr-10 appearance-none outline-none cursor-pointer"
                    >
                      <option>EPUB (Modern)</option>
                      <option>PDF (Standard)</option>
                      <option>MOBI (Legacy)</option>
                      <option>AZW3 (Kindle)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Library Path */}
                <div>
                  <label className="text-xs text-zinc-800 dark:text-zinc-300 font-bold mb-1.5 block">Library Path</label>
                  <Input 
                    type="text" 
                    value={libraryPath}
                    onChange={(e) => setLibraryPath(e.target.value)}
                    className="h-10 border border-zinc-200 dark:border-zinc-800 bg-[#f8fafc] dark:bg-zinc-900 text-xs font-semibold px-3 rounded-lg outline-none focus-visible:ring-0" 
                  />
                </div>

                {/* Interface Language */}
                <div>
                  <label className="text-xs text-zinc-800 dark:text-zinc-300 font-bold mb-1.5 block">Interface Language</label>
                  <div className="relative">
                    <select
                      value={interfaceLanguage}
                      onChange={(e) => setInterfaceLanguage(e.target.value)}
                      className="w-full h-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-xs font-semibold px-3 pr-10 appearance-none outline-none cursor-pointer"
                    >
                      <option>English (Oxford)</option>
                      <option>Bahasa Indonesia</option>
                      <option>Deutsch</option>
                      <option>Español</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Advanced (7 cols) */}
          <Card className="md:col-span-7 p-6 border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-none rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">Advanced</h2>
                {priorityList.length < 5 && (
                  <button 
                    onClick={handleResetPriority}
                    className="text-[10px] font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors uppercase tracking-wider"
                  >
                    Reset List
                  </button>
                )}
              </div>

              {/* Metadata Source Priority */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-800 dark:text-zinc-300 font-bold">Metadata Source Priority</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Reorder List</span>
                </div>
                
                <div className="flex flex-wrap gap-2 py-2">
                  {priorityList.map((source) => (
                    <div 
                      key={source}
                      className="flex items-center gap-1.5 bg-[#eff6ff] text-[#2563eb] dark:bg-blue-950/40 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100/50 dark:border-blue-900/20"
                    >
                      <span>{source}</span>
                      <button 
                        onClick={() => handleRemovePriority(source)}
                        className="hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {priorityList.length === 0 && (
                    <p className="text-xs text-zinc-400 italic py-2">No metadata source prioritized.</p>
                  )}
                </div>
              </div>

              {/* Conversion and Heuristic Row */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                
                {/* Conversion Engine */}
                <div>
                  <label className="text-xs text-zinc-800 dark:text-zinc-300 font-bold mb-1.5 block">Conversion Engine</label>
                  <div className="relative">
                    <select
                      value={conversionEngine}
                      onChange={(e) => setConversionEngine(e.target.value)}
                      className="w-full h-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-xs font-semibold px-3 pr-10 appearance-none outline-none cursor-pointer"
                    >
                      <option>Calibre Core 7.0</option>
                      <option>Calibre Core 6.0</option>
                      <option>Pandoc Standard</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Heuristic Processing Toggle */}
                <div>
                  <label className="text-xs text-zinc-800 dark:text-zinc-300 font-bold mb-3 block">Heuristic Processing</label>
                  <button 
                    onClick={() => setHeuristicProcessing(!heuristicProcessing)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none ${
                      heuristicProcessing ? "bg-[#1B2631]" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  >
                    <div 
                      className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        heuristicProcessing ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

              </div>
            </div>
          </Card>

        </div>

        {/* Card 3: Synchronization (Takes full width) */}
        <Card className="p-6 border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-zinc-950 shadow-none rounded-2xl">
          <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 mb-5">Synchronization</h2>
          
          <div className="flex flex-col gap-4">
            
            {/* Dropbox Item */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#f8fafc]/50 dark:bg-zinc-900/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center border border-blue-100 dark:border-blue-900/20 flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500 fill-current" viewBox="0 0 24 24">
                    <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zm-12 12l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM6 10l6 4 6-4-6-4-6 4zm6 9.5l6-4 6 4-12 2.5-12-2.5 6-4 6 4z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Dropbox</h4>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                    {dropboxConnected ? "Connected since Jan 2026" : "Not Configured"}
                  </p>
                </div>
              </div>
              <div>
                {dropboxConnected ? (
                  <button 
                    onClick={() => setDropboxConnected(false)}
                    className="text-xs font-bold text-red-500 hover:underline px-3 py-1 transition-all"
                  >
                    Disconnect
                  </button>
                ) : (
                  <Button 
                    onClick={() => setDropboxConnected(true)}
                    className="h-8 px-4 text-xs font-bold bg-[#1B2631] text-white hover:bg-black rounded-lg shadow-none"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* Google Drive Item */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#f8fafc]/50 dark:bg-zinc-900/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-150 dark:border-zinc-700 flex-shrink-0">
                  <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400 fill-current" viewBox="0 0 24 24">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Google Drive</h4>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                    {isGdriveConnecting ? "Connecting..." : gdriveConnected ? "Connected since May 2026" : "Not Configured"}
                  </p>
                </div>
              </div>
              <div>
                {gdriveConnected ? (
                  <button 
                    onClick={() => setGdriveConnected(false)}
                    className="text-xs font-bold text-red-500 hover:underline px-3 py-1 transition-all"
                  >
                    Disconnect
                  </button>
                ) : (
                  <Button 
                    onClick={handleGdriveConnect}
                    disabled={isGdriveConnecting}
                    className="h-8 px-4 text-xs font-bold bg-[#1B2631] text-white hover:bg-black rounded-lg shadow-none"
                  >
                    {isGdriveConnecting ? "Connecting..." : "Connect"}
                  </Button>
                )}
              </div>
            </div>

          </div>
        </Card>

        {/* Bottom Danger Zone */}
        <div className="border-t border-red-500 dark:border-red-650 pt-8 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">

          <div>
            <h3 className="text-lg font-bold text-red-500 font-serif">Danger Zone</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              Deleting your library or account data is permanent and cannot be undone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsExporting(true);
                setTimeout(() => setIsExporting(false), 2000);
              }}
              disabled={isExporting}
              className="h-10 px-5 rounded-lg border-zinc-900 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold text-xs shadow-none"
            >
              {isExporting ? "Exporting..." : "Export All Data"}
            </Button>
            <Button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="h-10 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-none border-0"
            >
              Delete Library
            </Button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-serif">Delete Library Permanently?</h3>
              <p className="text-xs text-zinc-500 mt-2">
                This action is irreversible. All your cataloged books, physical folders, custom tags, and configurations will be permanently removed from this system.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)}
                className="h-9 px-4 rounded-lg border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  alert("Calibre Library deletion process simulated successfully.");
                }}
                className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white border-0 text-xs font-semibold"
              >
                Yes, Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
