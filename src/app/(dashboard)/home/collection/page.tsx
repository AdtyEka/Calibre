"use client";

import React, { useState } from "react";
import { Plus, ChevronDown, LayoutGrid, List, ChevronRight, ExternalLink, Copy, FolderOpen, FileText, BookOpen, FileCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CollectionGrid from "./_components/CollectionGrid";

interface FileItem {
  name: string;
  dateModified: string;
  type: string;
  size: string;
  format: "pdf" | "epub" | "docx" | "opf" | "txt";
}

interface FolderItem {
  id: string;
  category: string;
  title: string;
  author: string;
  path: string;
  itemCount: number;
  totalSize: string;
  files: FileItem[];
}

export default function Collection() {
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [copied, setCopied] = useState(false);

  const books = [
    { title: "The Hunger Games", author: "Suzanne Collins", format: "EPUB", rating: 4 },
    { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", format: "PDF", rating: 3 },
    { title: "The Metamorphosis", author: "Franz Kafka", format: "AZW3", rating: 4 },
    { title: "Laut Bercerita", author: "Leila S. Chudori", format: "DOCX", rating: 4 },
    { title: "Dune", author: "Frank Herbert", format: "TXT", rating: 3 },
  ];

  const folders: FolderItem[] = [
    {
      id: "project-hail-mary",
      category: "FICTION",
      title: "Project Hail Mary",
      author: "Andy Weir",
      path: "/Volumes/Archive/Calibre_Main",
      itemCount: 4,
      totalSize: "198.16 MB",
      files: [
        { name: "Project Hail Mary - Andy Weir.pdf", dateModified: "15/03/2026", type: "PDF Document", size: "6.7 MB", format: "pdf" },
        { name: "Project Hail Mary.epub", dateModified: "07/03/2026", type: "EPUB Document", size: "5.1 MB", format: "epub" },
        { name: "book notes", dateModified: "17/03/2026", type: "Docx", size: "160 KB", format: "docx" },
        { name: "metadata.opf", dateModified: "17/07/2025", type: "OPF Data File", size: "7.8 MB", format: "opf" },
      ]
    },
    {
      id: "song-of-ice-and-fire",
      category: "FICTION",
      title: "A Song of Ice and Fire",
      author: "George R. R. Martin",
      path: "/Volumes/Archive/A_Song_of_Ice_and_Fire",
      itemCount: 5,
      totalSize: "45.2 MB",
      files: [
        { name: "A Game of Thrones.epub", dateModified: "12/02/2026", type: "EPUB Document", size: "3.2 MB", format: "epub" },
        { name: "A Clash of Kings.epub", dateModified: "14/02/2026", type: "EPUB Document", size: "3.5 MB", format: "epub" },
        { name: "A Storm of Swords.epub", dateModified: "18/02/2026", type: "EPUB Document", size: "4.1 MB", format: "epub" },
        { name: "Westeros Map.pdf", dateModified: "01/01/2026", type: "PDF Document", size: "12.4 MB", format: "pdf" },
        { name: "metadata.opf", dateModified: "10/01/2026", type: "OPF Data File", size: "1.2 MB", format: "opf" },
      ]
    },
    {
      id: "hunger-games",
      category: "FICTION",
      title: "The Hunger Games",
      author: "Suzanne Collins",
      path: "/Volumes/Archive/The_Hunger_Games",
      itemCount: 3,
      totalSize: "18.4 MB",
      files: [
        { name: "The Hunger Games.epub", dateModified: "20/01/2026", type: "EPUB Document", size: "2.1 MB", format: "epub" },
        { name: "Catching Fire.epub", dateModified: "22/01/2026", type: "EPUB Document", size: "2.4 MB", format: "epub" },
        { name: "Mockingjay.epub", dateModified: "25/01/2026", type: "EPUB Document", size: "2.3 MB", format: "epub" },
      ]
    },
    {
      id: "brothers-karamazov",
      category: "FICTION",
      title: "The Brothers Karamazov",
      author: "Fyodor Dostoevsky",
      path: "/Volumes/Archive/Dostoevsky_Collection",
      itemCount: 3,
      totalSize: "12.8 MB",
      files: [
        { name: "The Brothers Karamazov.pdf", dateModified: "05/03/2026", type: "PDF Document", size: "8.4 MB", format: "pdf" },
        { name: "character_index.docx", dateModified: "06/03/2026", type: "Docx", size: "45 KB", format: "docx" },
        { name: "metadata.opf", dateModified: "10/01/2026", type: "OPF Data File", size: "1.1 MB", format: "opf" },
      ]
    }
  ];

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return (
          <div className="flex items-center justify-center mr-3 text-red-500 font-bold">
            <span className="text-[10px] tracking-tight border-2 border-red-500 px-1 py-0.5 rounded font-mono leading-none">PDF</span>
          </div>
        );
      case "epub":
        return (
          <div className="flex items-center justify-center mr-3 text-blue-500 font-bold">
            <span className="text-[10px] tracking-tight border-2 border-blue-500 px-1 py-0.5 rounded font-mono leading-none">EPUB</span>
          </div>
        );
      case "docx":
        return (
          <div className="flex items-center justify-center mr-3 text-indigo-500 font-bold">
            <span className="text-[10px] tracking-tight border-2 border-indigo-500 px-1 py-0.5 rounded font-mono leading-none">DOCX</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center mr-3 text-zinc-500 font-bold">
            <span className="text-[10px] tracking-tight border-2 border-zinc-500 px-1 py-0.5 rounded font-mono leading-none">OPF</span>
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex-1 p-8 flex flex-col gap-8 relative bg-white dark:bg-zinc-950 min-h-screen">
        {selectedFolder ? (
          /* Folder Explorer View */
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
              <button 
                onClick={() => setSelectedFolder(null)} 
                className="hover:text-zinc-700 dark:hover:text-zinc-300 font-medium transition-colors cursor-pointer"
              >
                Collections
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-zinc-600 dark:text-zinc-300 font-medium">{selectedFolder.title}</span>
            </div>

            {/* Folder Header */}
            <div className="flex items-start gap-4">
              {/* Overlapping Folder Cover Icon */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg flex items-center justify-center bg-zinc-900">
                <div className="absolute inset-0 bg-radial from-zinc-700 to-zinc-950 opacity-80" />
                <FolderOpen className="w-6 h-6 text-zinc-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 z-20 pointer-events-none" />
              </div>

              {/* Title & Path */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold font-serif text-zinc-900 dark:text-white tracking-tight leading-tight">
                  {selectedFolder.title}
                </h1>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-1">
                  {selectedFolder.path}
                </p>
              </div>
            </div>

            {/* Controls and Operations Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
              {/* Sort and Grid buttons */}
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg text-sm">
                <div className="flex items-center gap-1 px-3 py-1.5">
                  <span className="text-zinc-500">Sort by:</span>
                  <Button className="h-auto p-0 bg-transparent font-medium flex items-center gap-1 text-zinc-900 dark:text-zinc-100 shadow-none hover:bg-transparent">
                    Date Added <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800 h-6" />
                <Button className="h-auto p-1.5 bg-white dark:bg-zinc-800 rounded-md shadow-xs border border-zinc-200 dark:border-zinc-700">
                  <LayoutGrid className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                </Button>
                <Button className="h-auto p-1.5 bg-transparent text-zinc-500 shadow-none hover:bg-transparent">
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Button 
                  onClick={() => alert(`Opening files folder at "${selectedFolder.path}"`)}
                  className="h-10 bg-[#1B2E3C] hover:bg-[#13212C] text-white font-semibold rounded-lg flex items-center justify-center px-4 shadow-sm border border-transparent transition-colors cursor-pointer text-sm w-full md:w-auto"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in File Explorer
                </Button>
                <Button 
                  onClick={() => handleCopyPath(selectedFolder.path)}
                  className="h-10 bg-white hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 font-semibold rounded-lg flex items-center justify-center px-4 shadow-sm transition-colors cursor-pointer text-sm w-full md:w-auto"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2 text-zinc-500" />
                      Copy Path
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Files Table Container */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/40 shadow-xs mt-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/30">
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Date Modified</th>
                      <th className="px-6 py-4 font-bold">Type</th>
                      <th className="px-6 py-4 font-bold">Size</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-300">
                    {selectedFolder.files.map((file, idx) => (
                      <tr 
                        key={idx} 
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4 font-semibold text-zinc-800 dark:text-zinc-100 flex items-center">
                          {getFileIcon(file.format)}
                          <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {file.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-medium">
                          {file.dateModified}
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-medium">
                          {file.type}
                        </td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-medium">
                          {file.size}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status Footer strip matching exactly the colors and style in the image */}
              <div className="flex justify-between items-center px-6 py-3 bg-[#EAEFF5] dark:bg-zinc-900/60 text-xs text-[#527A9C] dark:text-zinc-400 font-semibold border-t border-zinc-200 dark:border-zinc-850">
                <span>{selectedFolder.itemCount} items in folder</span>
                <span>All files synced</span>
                <span>Total Size: {selectedFolder.totalSize}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Main Collections & Folders List View */
          <>
            <h1 className="text-4xl font-bold font-serif mb-6 text-zinc-900 dark:text-white">Your Collections</h1>

            {/* Book Grid */}
            <CollectionGrid books={books} />

            {/* Folders Section */}
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white">Folders</h2>
                  <p className="text-sm text-zinc-500 mt-1">Manage Your Digital Archive — Group Files According to Your Preferred Structure</p>
                  <p className="text-sm text-zinc-500">15 Folders in Archive</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Split Button for New Folders */}
                  <div className="flex items-center rounded-md overflow-hidden bg-[#243342] text-white text-sm font-medium">
                    <Button className="h-auto hover:bg-[#1B2631] px-4 py-2 transition-colors bg-transparent rounded-none shadow-none cursor-pointer">
                      New Folders
                    </Button>
                    <div className="w-[1px] bg-white/20 h-5" />
                    <Button className="h-auto hover:bg-[#1B2631] px-2 py-2 flex items-center justify-center transition-colors bg-transparent rounded-none shadow-none cursor-pointer">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg text-sm">
                    <div className="flex items-center gap-1 px-3 py-1.5">
                      <span className="text-zinc-500">Sort by:</span>
                      <Button className="h-auto p-0 bg-transparent font-medium flex items-center gap-1 text-zinc-900 dark:text-zinc-100 shadow-none hover:bg-transparent">
                        Date Added <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800 h-6" />
                    <Button className="h-auto p-1.5 bg-[#2C3E50] dark:bg-zinc-800 rounded-md shadow-xs">
                      <LayoutGrid className="w-4 h-4 text-white" />
                    </Button>
                    <Button className="h-auto p-1.5 bg-transparent text-zinc-500 shadow-none hover:bg-transparent">
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Folders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {folders.map((folder, index) => (
                  <Card 
                    key={index} 
                    onClick={() => setSelectedFolder(folder)}
                    className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-none cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-250 hover:shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 mb-1.5 block group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {folder.category}
                      </span>
                      <h3 className="text-xl font-bold font-serif mb-1 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {folder.title}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                      {folder.author}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Floating Action Button (FAB) */}
        <Button className="fixed bottom-20 right-8 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 z-50 p-0 border border-transparent cursor-pointer">
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>
    </>
  );
}