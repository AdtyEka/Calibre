"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  Download, 
  Edit, 
  BookOpen, 
  Database, 
  Gauge, 
  HardDrive,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import FormatSelector from "./_components/FormatSelector";

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

export default function ConvertFormat() {
  const [queue, setQueue] = useState<QueueItem[]>([
    {
      id: "q1",
      title: "The Silent Archive",
      author: "A. H. Sterling",
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
      title: "The Silent Archive",
      author: "A. H. Sterling",
      size: "2.4 MB",
      fromFormat: "AZW3",
      toFormat: "EPUB",
      status: "Waiting",
      progress: 0
    }
  ]);

  const [fetchMetadata, setFetchMetadata] = useState(true);
  const [extractFromFile, setExtractFromFile] = useState(true);
  const [defaultOutput, setDefaultOutput] = useState("EPUB (Modern)");
  const [qualityProfile, setQualityProfile] = useState("High (300 DPI)");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animate the converting queue item
  useEffect(() => {
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
  }, []);

  // Handle manual file upload selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newId = `q-${Date.now()}`;
      
      // Determine format from extension
      const ext = file.name.split('.').pop()?.toUpperCase() || "PDF";
      
      const newItem: QueueItem = {
        id: newId,
        title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
        author: "Unknown Author",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fromFormat: ext,
        toFormat: defaultOutput.split(" ")[0], // standard conversion format
        status: "Converting",
        progress: 0
      };

      setQueue(prev => [newItem, ...prev]);

      // Simple upload progress simulation
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

    // Simulate retry progress
    let prog = 0;
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

  return (
    <div className="flex-1 p-8 flex flex-col gap-8 relative w-full  pb-24">
      {/* Title Header */}
      <div>
        <h1 className="text-4xl font-bold font-serif mb-2 text-zinc-900 dark:text-zinc-100">Upload & Conversion</h1>
        <p className="text-zinc-500 text-sm">
          Manage your digital archive by importing new volumes and optimizing them for your preferred reading hardware.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Upload New Books */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <Upload className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">Upload New Books</h2>
          </div>

          <Card className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 bg-white dark:bg-zinc-900 shadow-none flex flex-col items-center">
            {/* Drag & Drop Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                <Upload className="w-6 h-6 text-zinc-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">Drag & Drop Files Here</p>
                <p className="text-xs text-zinc-400 mt-1">.EPUB, .PDF, .MOBI, .AZW3 up to 50MB</p>
              </div>
              <Button className="h-10 px-6 rounded-lg bg-[#1B2631] hover:bg-black text-white font-medium text-sm transition-colors shadow-none mt-2">
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

            {/* Checkbox Options */}
            <div className="w-full flex flex-col gap-3 mt-6">
              <label className="flex items-start gap-3 cursor-pointer text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <input 
                  type="checkbox" 
                  checked={fetchMetadata}
                  onChange={(e) => setFetchMetadata(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-300 dark:border-zinc-750 text-[#1e293b] focus:ring-[#1e293b]" 
                />
                <span>Fetch metadata automatically (ISBNDB, Google Books, DOI)</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <input 
                  type="checkbox" 
                  checked={extractFromFile}
                  onChange={(e) => setExtractFromFile(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-300 dark:border-zinc-750 text-[#1e293b] focus:ring-[#1e293b]" 
                />
                <span>Attempt to extract from file</span>
              </label>
            </div>

            {/* Global Preferences */}
            <FormatSelector 
              defaultOutput={defaultOutput}
              setDefaultOutput={setDefaultOutput}
              qualityProfile={qualityProfile}
              setQualityProfile={setQualityProfile}
            />
          </Card>
        </div>

        {/* Right Column: Queue */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <RefreshCw className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">Queue</h2>
          </div>

          <div className="flex flex-col gap-4">
            {queue.map((item) => (
              <Card key={item.id} className="p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-none flex items-start gap-4">
                
                {/* Book Thumbnail Placeholder */}
                <div className="w-14 h-18 rounded bg-blue-100 dark:bg-blue-900/20 flex-shrink-0" />
                
                {/* Book & Conversion Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.title}</h4>
                      <p className="text-xs text-zinc-400 font-semibold truncate mt-0.5">{item.author} • {item.size}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.status === "Converting" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" :
                        item.status === "Completed" ? "bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400" :
                        item.status === "Error" ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400" :
                        "bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {item.status}
                      </span>
                      {item.errorMsg && (
                        <span className="text-[10px] text-red-500 dark:text-red-400 italic mt-0.5 font-bold">{item.errorMsg}</span>
                      )}
                    </div>
                  </div>

                  {/* Formats & Conversion Progress Bar */}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.fromFormat}</span>
                    <span className="text-zinc-300 dark:text-zinc-800 font-bold text-[10px]">&rarr;</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.toFormat}</span>
                    
                    {/* Status Icon */}
                    {item.status === "Converting" && <Edit className="w-3.5 h-3.5 text-zinc-400 animate-pulse ml-1" />}
                    {item.status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-1" />}
                    {item.status === "Error" && <AlertCircle className="w-3.5 h-3.5 text-red-500 ml-1" />}
                    {item.status === "Waiting" && <Clock className="w-3.5 h-3.5 text-zinc-400 ml-1" />}

                    {/* Progress Slider Bar */}
                    <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative mx-2">
                      <div 
                        className={`h-full transition-all duration-300 rounded-full ${
                          item.status === "Converting" ? "bg-[#2c3e50] dark:bg-zinc-300" :
                          item.status === "Completed" ? "bg-green-500" :
                          item.status === "Error" ? "bg-red-500 w-[40%]" :
                          "bg-zinc-200 dark:bg-zinc-700 w-0"
                        }`}
                        style={item.status === "Converting" || item.status === "Completed" ? { width: `${item.progress}%` } : {}}
                      />
                    </div>

                    {/* End Action Button */}
                    <div className="w-6 flex items-center justify-center">
                      {item.status === "Converting" && (
                        <span className="text-[10px] font-bold text-zinc-500">{Math.round(item.progress)}%</span>
                      )}
                      {item.status === "Completed" && (
                        <button className="text-zinc-500 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      {item.status === "Error" && (
                        <button onClick={() => handleRetry(item.id)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" title="Retry">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      {item.status === "Waiting" && (
                        <button onClick={() => handleRemove(item.id)} className="text-zinc-400 hover:text-red-500 transition-colors" title="Cancel">
                          <X className="w-4 h-4" />
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

      {/* Recent Imports */}
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            <h2 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">Recent Imports</h2>
          </div>
          <button className="text-xs font-bold text-[#64748b] hover:opacity-75 transition-opacity">View Full History</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Percy Jackson and The Ol...", author: "Rick Riordan", date: "March 15th, 2026" },
            { title: "Atomic Habits", author: "James Clear", date: "March 15th, 2026" },
            { title: "Alchemised", author: "SenLinYu", date: "March 15th, 2026" }
          ].map((item, idx) => (
            <Card key={idx} className="p-5 border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-2xl shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-150 truncate mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mb-4">{item.author}</p>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Imported on {item.date}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Metrics Row at Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 border-t border-zinc-200/50 dark:border-zinc-800 pt-8">
        
        {/* Metric 1: Library Size */}
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800">
            <Database className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold tracking-wide uppercase">Library Size</p>
            <p className="text-2xl font-bold font-serif text-zinc-800 dark:text-zinc-100 mt-0.5">3,1506 Volumes</p>
          </div>
        </div>

        {/* Metric 2: Speed */}
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800">
            <Gauge className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold tracking-wide uppercase">Conversion Speed</p>
            <p className="text-2xl font-bold font-serif text-zinc-800 dark:text-zinc-100 mt-0.5">6.7 books/min</p>
          </div>
        </div>

        {/* Metric 3: Cloud Storage */}
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800">
            <HardDrive className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold tracking-wide uppercase">Cloud Storage</p>
            <p className="text-2xl font-bold font-serif text-zinc-800 dark:text-zinc-100 mt-0.5">15.3 GB/ 60 GB</p>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-zinc-700 dark:bg-zinc-300 rounded-full w-[25.5%]" />
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-24 right-8 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 duration-200 z-40 animate-bounce"
        style={{ animationDuration: "3s" }}
        title="Add New Book"
      >
        <Plus className="w-6 h-6" />
      </button>

    </div>
  );
}
