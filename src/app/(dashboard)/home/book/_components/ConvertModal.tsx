"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QueueItem {
  id: string;
  title: string;
  author: string;
  size: string;
  fromFormat: string;
  toFormat: string;
  status: "Converting" | "Completed" | "Error" | "Waiting";
  progress: number;
  errorMsg?: string;
}

interface ConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConvertModal({ isOpen, onClose }: ConvertModalProps) {
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "q1",
      title: "The Black Company",
      author: "Glenn Cook",
      size: "2.04 MB",
      fromFormat: "PDF",
      toFormat: "EPUB",
      status: "Converting",
      progress: 65
    },
    {
      id: "q2",
      title: "Once Upon a Broken Heart",
      author: "Stephanie Garber",
      size: "4.18 MB",
      fromFormat: "EPUB",
      toFormat: "MOBI",
      status: "Completed",
      progress: 100
    },
    {
      id: "q3",
      title: "The Laws of Human Nature",
      author: "Robert Greene",
      size: "1.01 MB",
      fromFormat: "HTML",
      toFormat: "EPUB",
      status: "Error",
      progress: 40,
      errorMsg: "Corrupt Source File"
    },
    {
      id: "q4",
      title: "Dune",
      author: "Frank Herbert",
      size: "2.4 MB",
      fromFormat: "AZW3",
      toFormat: "EPUB",
      status: "Waiting",
      progress: 0
    }
  ]);

  const [fetchMetadata, setFetchMetadata] = useState(true);
  const [extractFromFile, setExtractFromFile] = useState(true);
  const [inputFormat, setInputFormat] = useState("PDF");
  const [outputFormat, setOutputFormat] = useState("AW2");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animate the converting queue item
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setQueue(prev => prev.map(item => {
        if (item.status === "Converting") {
          const nextProgress = item.progress + 2;
          if (nextProgress >= 100) {
            return { ...item, status: "Completed", progress: 100 };
          }
          return { ...item, progress: nextProgress };
        }
        return item;
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle manual file upload selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newId = `q-${Date.now()}`;
      
      const ext = file.name.split('.').pop()?.toUpperCase() || "PDF";
      
      const newItem: QueueItem = {
        id: newId,
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: "Unknown Author",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fromFormat: ext,
        toFormat: outputFormat,
        status: "Converting",
        progress: 0
      };

      setQueue(prev => [newItem, ...prev]);

      let prog = 0;
      const progInterval = setInterval(() => {
        setQueue(prev => prev.map(item => {
          if (item.id === newId) {
            const nextP = item.progress + 10;
            if (nextP >= 100) {
              clearInterval(progInterval);
              return { ...item, status: "Completed", progress: 100 };
            }
            return { ...item, progress: nextP };
          }
          return item;
        }));
      }, 500);
    }
  };

  const handleRetry = (id: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: "Converting", progress: 0, errorMsg: undefined };
      }
      return item;
    }));

    const retryInterval = setInterval(() => {
      setQueue(prev => prev.map(item => {
        if (item.id === id) {
          const nextP = item.progress + 15;
          if (nextP >= 100) {
            clearInterval(retryInterval);
            return { ...item, status: "Completed", progress: 100 };
          }
          return { ...item, progress: nextP };
        }
        return item;
      }));
    }, 600);
  };

  const handleRemove = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const renderCover = (title: string) => {
    if (title === "The Black Company") {
      return (
        <div className="w-[70px] h-[95px] rounded-lg shadow-md overflow-hidden relative flex-shrink-0 flex flex-col justify-between p-2 text-center font-serif bg-gradient-to-b from-[#1C2C24] via-[#101A15] to-black border border-zinc-800/80 select-none">
          <div className="text-[7px] text-[#A3E635]/80 font-bold uppercase tracking-wider leading-tight">GLEN COOK</div>
          <div className="text-[9px] text-[#E2E8F0] font-bold uppercase tracking-wide leading-tight my-auto">THE BLACK COMPANY</div>
          <div className="h-1 w-6 bg-[#A3E635]/30 rounded-full mx-auto" />
        </div>
      );
    }
    if (title === "Once Upon a Broken Heart") {
      return (
        <div className="w-[70px] h-[95px] rounded-lg shadow-md overflow-hidden relative flex-shrink-0 flex flex-col justify-between p-2 text-center font-serif bg-gradient-to-b from-[#3C1D2D] via-[#24111B] to-black border border-zinc-800/80 select-none">
          <div className="text-[7px] text-pink-450/80 font-bold uppercase tracking-wider leading-tight">STEPHANIE G.</div>
          <div className="text-[8px] text-pink-100 font-bold uppercase tracking-wide leading-tight my-auto">ONCE UPON A BROKEN HEART</div>
          <div className="h-1 w-6 bg-pink-400/30 rounded-full mx-auto" />
        </div>
      );
    }
    if (title === "The Laws of Human Nature") {
      return (
        <div className="w-[70px] h-[95px] rounded-lg shadow-md overflow-hidden relative flex-shrink-0 flex flex-col justify-between p-2 text-center font-serif bg-gradient-to-b from-[#991B1B] via-[#7F1D1D] to-[#450A0A] border border-zinc-800/80 select-none">
          <div className="text-[7px] text-amber-400/80 font-bold uppercase tracking-wider leading-tight">R. GREENE</div>
          <div className="text-[8px] text-amber-100 font-bold uppercase tracking-wide leading-tight my-auto">THE LAWS OF HUMAN NATURE</div>
          <div className="h-1 w-6 bg-amber-400/30 rounded-full mx-auto" />
        </div>
      );
    }
    if (title === "Dune") {
      return (
        <div className="w-[70px] h-[95px] rounded-lg shadow-md overflow-hidden relative flex-shrink-0 flex flex-col justify-between p-2 text-center font-serif bg-gradient-to-b from-[#D97706] via-[#92400E] to-[#451A03] border border-zinc-800/80 select-none">
          <div className="text-[7px] text-yellow-500/80 font-bold uppercase tracking-wider leading-tight">F. HERBERT</div>
          <div className="text-[12px] text-yellow-50 font-black uppercase tracking-widest leading-none my-auto">DUNE</div>
          <div className="h-1 w-6 bg-yellow-500/30 rounded-full mx-auto" />
        </div>
      );
    }
    
    // Newly uploaded items
    return (
      <div className="w-[70px] h-[95px] rounded-lg shadow-md overflow-hidden relative flex-shrink-0 flex flex-col justify-between p-2 text-center font-serif bg-gradient-to-b from-[#3B82F6] via-[#1D4ED8] to-[#1E3A8A] border border-zinc-800/80 select-none">
        <div className="text-[7px] text-blue-200/80 font-bold uppercase tracking-wider leading-tight">UPLOAD</div>
        <div className="text-[9px] text-white font-bold uppercase tracking-wide leading-tight my-auto truncate">{title}</div>
        <div className="h-1 w-6 bg-blue-200/30 rounded-full mx-auto" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-[1020px] max-h-[92vh] overflow-y-auto rounded-[28px] border border-zinc-200/80 dark:border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col relative animate-in fade-in zoom-in-95 duration-250">
        {/* Modal Header */}
        <div className="p-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-955 sticky top-0 z-10 flex items-start justify-between">
          <div>
            <h2 className="text-[34px] font-bold font-serif text-[#1e293b] dark:text-zinc-100 tracking-tight leading-none">Conversion</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2.5 font-medium">Convert your files into your preferred format</p>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="text-[#475569] dark:text-zinc-300 font-semibold hover:text-black dark:hover:text-white transition-colors cursor-pointer text-sm px-4 py-2">Cancel</button>
            <Button onClick={onClose} className="bg-[#1A2530] hover:bg-[#111922] dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white px-6 rounded-full font-bold text-sm h-11 shadow-sm transition-colors cursor-pointer flex items-center justify-center">Save Changes</Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 pt-6 flex flex-col gap-8 pb-12 bg-white dark:bg-zinc-950">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            
            {/* Left Column: Upload New Books */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-zinc-755 dark:text-zinc-300">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 tracking-tight">Upload New Books</h2>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-[20px] p-6 bg-white dark:bg-zinc-900/40 shadow-none flex flex-col">
                {/* Drag & Drop Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-[#A0AEC0] dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:14px_14px] bg-[#FAFBFD] dark:bg-zinc-950/40 cursor-pointer transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#E0E7FF] dark:bg-indigo-950/50 flex items-center justify-center border border-[#C7D2FE] dark:border-indigo-900/50 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#4F46E5] dark:text-indigo-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </div>
                  
                  <div className="text-center select-none">
                    <p className="font-bold font-serif text-lg text-zinc-800 dark:text-zinc-200 tracking-tight">Drag & Drop Files Here</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mt-1">EPUB, PDF, MOBI, AZW3 up to 50MB</p>
                  </div>
                  
                  <Button className="h-10 px-6 rounded-xl bg-[#1A2530] hover:bg-[#111922] dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white font-bold text-xs shadow-none mt-2 transition-colors cursor-pointer flex items-center justify-center">
                    Select from Computer
                  </Button>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept=".epub,.pdf,.mobi,.azw3"
                    className="hidden" 
                  />
                </div>

                {/* Custom checkboxes */}
                <div className="w-full flex flex-col gap-4 mt-6">
                  <label className="flex items-center gap-3.5 cursor-pointer text-sm font-semibold text-zinc-700 dark:text-zinc-300 select-none">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={fetchMetadata}
                        onChange={(e) => setFetchMetadata(e.target.checked)}
                        className="peer appearance-none w-5 h-5 rounded-md border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:bg-[#1A2530] checked:border-[#1A2530] dark:checked:bg-zinc-100 dark:checked:border-zinc-100 transition-all cursor-pointer" 
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute w-3.5 h-3.5 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-serif text-[#1A2530] dark:text-zinc-200 font-medium text-sm">Fetch metadata automatically (ISBNDB, Google Books, DOI)</span>
                  </label>
                  
                  <label className="flex items-center gap-3.5 cursor-pointer text-sm font-semibold text-zinc-700 dark:text-zinc-300 select-none">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={extractFromFile}
                        onChange={(e) => setExtractFromFile(e.target.checked)}
                        className="peer appearance-none w-5 h-5 rounded-md border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:bg-[#1A2530] checked:border-[#1A2530] dark:checked:bg-zinc-100 dark:checked:border-zinc-100 transition-all cursor-pointer" 
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute w-3.5 h-3.5 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="font-serif text-[#1A2530] dark:text-zinc-200 font-medium text-sm">Attempt to extract from file</span>
                  </label>
                </div>

                {/* Book Format Toned Card */}
                <div className="bg-[#EFF4F9] dark:bg-zinc-900/60 border border-[#E2ECF2] dark:border-zinc-800 rounded-2xl p-5 mt-5">
                  <h3 className="text-[15px] font-bold font-serif text-[#1e293b] dark:text-zinc-100 mb-3">Book Format</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5 block">Input Format</label>
                      <div className="relative">
                        <select 
                          value={inputFormat}
                          onChange={(e) => setInputFormat(e.target.value)}
                          className="w-full h-11 border border-zinc-200/80 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-750 dark:text-zinc-200 px-3.5 pr-8 appearance-none outline-none cursor-pointer shadow-sm"
                        >
                          <option>PDF</option>
                          <option>EPUB</option>
                          <option>MOBI</option>
                          <option>AZW3</option>
                          <option>HTML</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-450">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5 block">Output Format</label>
                      <div className="relative">
                        <select 
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          className="w-full h-11 border border-zinc-200/80 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-750 dark:text-zinc-200 px-3.5 pr-8 appearance-none outline-none cursor-pointer shadow-sm"
                        >
                          <option>AW2</option>
                          <option>EPUB</option>
                          <option>MOBI</option>
                          <option>PDF</option>
                          <option>AZW3</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-450">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Queue */}
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-100 dark:border-zinc-800 mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-zinc-755 dark:text-zinc-350">
                    <path d="m17 2 4 4-4 4" />
                    <path d="M3 6h18" />
                    <path d="m7 22-4-4 4-4" />
                    <path d="M21 18H3" />
                  </svg>
                  <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-100 tracking-tight">Queue</h2>
                </div>

                <div className="flex flex-col gap-4 max-h-[465px] overflow-y-auto pr-1">
                  {queue.map((item) => (
                    <Card key={item.id} className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-none flex items-start gap-4">
                      
                      {/* Beautiful Cover Art Placeholder */}
                      {renderCover(item.title)}
                      
                      {/* Book & Conversion Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-[95px]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="font-bold font-serif text-[15px] text-zinc-900 dark:text-zinc-100 truncate tracking-tight">{item.title}</h4>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold truncate mt-0.5">{item.author} • {item.size}</p>
                          </div>

                          {/* Status Badge */}
                          <div className="flex flex-col items-end flex-shrink-0">
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              item.status === "Converting" ? "bg-[#E8F0FE] text-[#1A73E8]" :
                              item.status === "Completed" ? "bg-[#E6F4EA] text-[#137333]" :
                              item.status === "Error" ? "bg-[#FCE8E6] text-[#C5221F]" :
                              "bg-[#F1F3F4] text-[#5F6368]"
                            }`}>
                              {item.status}
                            </span>
                            {item.errorMsg && (
                              <span className="text-[10px] text-red-500 dark:text-red-400 italic mt-0.5 font-bold tracking-wide">{item.errorMsg}</span>
                            )}
                          </div>
                        </div>

                        {/* Formats & Conversion Progress Bar */}
                        <div className="flex items-center gap-2 w-full mt-auto">
                          {/* Format route */}
                          <div className="flex items-center text-[10px] font-bold text-zinc-400 select-none">
                            <span>{item.fromFormat}</span>
                            <span className="mx-1.5 text-zinc-355 dark:text-zinc-700">&rarr;</span>
                            <span>{item.toFormat}</span>
                          </div>
                          
                          {/* Status icon */}
                          <div className="flex-shrink-0 ml-1">
                            {item.status === "Converting" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 animate-pulse">
                                <path d="M12 20h9"/>
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                              </svg>
                            )}
                            {item.status === "Completed" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                            {item.status === "Error" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-red-500">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                              </svg>
                            )}
                            {item.status === "Waiting" && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                            )}
                          </div>
                          
                          {/* Progress Slider Bar */}
                          <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative mx-1">
                            <div 
                              className={`h-full transition-all duration-300 rounded-full ${
                                item.status === "Converting" ? "bg-[#1E293B] dark:bg-zinc-300" :
                                item.status === "Completed" ? "bg-green-500" :
                                item.status === "Error" ? "bg-red-500" :
                                "bg-zinc-200 dark:bg-zinc-700 w-0"
                              }`}
                              style={{
                                width: item.status === "Converting" ? `${item.progress}%` : 
                                       item.status === "Completed" ? "100%" :
                                       item.status === "Error" ? "40%" : "0%"
                              }}
                            />
                          </div>

                          {/* End Action Button */}
                          <div className="flex-shrink-0 w-8 text-right flex items-center justify-end">
                            {item.status === "Converting" && (
                              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">{Math.round(item.progress)}%</span>
                            )}
                            {item.status === "Completed" && (
                              <button className="text-zinc-500 hover:text-zinc-850 dark:hover:text-zinc-200 transition-colors cursor-pointer flex items-center justify-center" title="Download">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              </button>
                            )}
                            {item.status === "Error" && (
                              <button onClick={() => handleRetry(item.id)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer flex items-center justify-center" title="Retry">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                              </button>
                            )}
                            {item.status === "Waiting" && (
                              <button onClick={() => handleRemove(item.id)} className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center" title="Cancel">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Recent Imports Section */}
          <div className="flex flex-col gap-5 mt-6 border-t border-zinc-200/50 dark:border-zinc-800/80 pt-6">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-200/50 dark:border-zinc-850">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-green-600 dark:text-green-455">
                  <path d="M2 22c1.25-1.5 3-3.85 4.65-6C9.8 12.2 11.25 10 15 6.5 19 3 20 2.5 22 2c-.5 2-1 3-4.5 7-3.5 3.75-5.7 5.2-9.5 8.35-2.15 1.65-4.5 3.4-6 4.65Z"/>
                  <path d="M9 15c1.5-1.5 3-1.5 4.5-3"/>
                </svg>
                <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 tracking-tight">Recent Imports</h2>
              </div>
              <button className="text-xs font-bold text-[#475569] hover:opacity-75 transition-opacity cursor-pointer">View Full History</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Percy Jackson and The Ol...", author: "Rick Riordan", date: "March 15th, 2026" },
                { title: "Atomic Habits", author: "James Clear", date: "March 15th, 2026" },
                { title: "Alchemised", author: "SenLinYu", date: "March 15th, 2026" }
              ].map((item, idx) => (
                <Card key={idx} className="p-5 border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 rounded-2xl shadow-none hover:border-zinc-350 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between h-[120px]">
                  <div>
                    <h4 className="font-bold font-serif text-[15px] text-zinc-900 dark:text-zinc-150 truncate mb-1 leading-snug">{item.title}</h4>
                    <p className="text-xs text-zinc-400 dark:text-zinc-550 font-semibold truncate mb-4">{item.author}</p>
                  </div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-550 font-medium">Imported on {item.date}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Metrics Row at Bottom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 border-t border-zinc-200/50 dark:border-zinc-800/80 pt-8 pb-4">
            
            {/* Metric 1: Library Size */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF4F9] dark:bg-zinc-900/60 flex items-center justify-center border border-[#E2ECF2] dark:border-zinc-855 shadow-sm flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-zinc-750 dark:text-zinc-300">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-550 font-bold tracking-wider uppercase">Library Size</p>
                <p className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100 mt-0.5">3,1506 Volumes</p>
              </div>
            </div>

            {/* Metric 2: Speed */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF4F9] dark:bg-zinc-900/60 flex items-center justify-center border border-[#E2ECF2] dark:border-zinc-855 shadow-sm flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-zinc-750 dark:text-zinc-300">
                  <path d="M2 12a10 10 0 1 1 20 0" />
                  <path d="m19 12-4-4" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-400 dark:text-zinc-550 font-bold tracking-wider uppercase">Conversion Speed</p>
                <p className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100 mt-0.5">6.7 books/min</p>
              </div>
            </div>

            {/* Metric 3: Cloud Storage */}
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF4F9] dark:bg-zinc-900/60 flex items-center justify-center border border-[#E2ECF2] dark:border-zinc-855 shadow-sm flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-zinc-750 dark:text-zinc-300">
                  <rect width="20" height="8" x="2" y="3" rx="2" />
                  <rect width="20" height="8" x="2" y="13" rx="2" />
                  <path d="M6 7h.01" />
                  <path d="M6 17h.01" />
                  <path d="M20 7h.01" />
                  <path d="M20 17h.01" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-400 dark:text-zinc-550 font-bold tracking-wider uppercase">Cloud Storage</p>
                <p className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100 mt-0.5 font-semibold">15.3 GB/ 60 GB</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
