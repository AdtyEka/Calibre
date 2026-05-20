"use client";

import { useState } from "react";
import { X, Search, Lock, Unlock, Download, Store, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GetBooksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GetBooksModal({ isOpen, onClose }: GetBooksModalProps) {
  const [bookTitle, setBookTitle] = useState("Six of Crows");
  const [author, setAuthor] = useState("Leigh Bardugo");
  const [keyword, setKeyword] = useState("Six of Crows");

  const [stores, setStores] = useState([
    { id: 1, name: "Amazon AU Kindle", checked: true },
    { id: 2, name: "Amazon CA Kindle", checked: true },
    { id: 3, name: "Amazon DE Kindle", checked: true },
    { id: 4, name: "Amazon ES Kindle", checked: true },
    { id: 5, name: "Amazon FR Kindle", checked: true },
    { id: 6, name: "Amazon IN Kindle", checked: true },
    { id: 7, name: "Amazon IT Kindle", checked: true },
    { id: 8, name: "Amazon Kindle", checked: true },
    { id: 9, name: "Amazon UK Kindle", checked: true },
    { id: 10, name: "Archive.org", checked: false },
    { id: 11, name: "Baen Ebooks", checked: false },
    { id: 12, name: "Barnes and Noble", checked: false },
    { id: 13, name: "Beam Ebooks DE", checked: false },
    { id: 14, name: "Bubok Portugal", checked: false },
    { id: 15, name: "Bubok Spain", checked: false },
    { id: 16, name: "ebook.de", checked: false },
    { id: 17, name: "ebook.nl", checked: false },
    { id: 18, name: "Ebookpoint", checked: false },
    { id: 19, name: "eBooks.com", checked: false },
    { id: 20, name: "EbookSecteurPublic", checked: false },
    { id: 21, name: "Empik", checked: false },
    { id: 22, name: "FeedBooks", checked: false },
  ]);

  const results = [
    { id: 1, title: "Six of Crows", price: "IDR 0.00", drm: "locked", store: "Barnes and Noble" },
    { id: 2, title: "Six of Crows", price: "IDR 68,174", drm: "unlocked", store: "Project Gutenberg TXT, HTML, MP3" },
    { id: 3, title: "Six of Crows", price: "IDR 0.00", drm: "unlocked", store: "Amazon Kindle" },
    { id: 4, title: "Six of Crows", price: "48.58 €", drm: "locked", store: "Amazon Kindle" },
    { id: 5, title: "Six of Crows", price: "33.38 €", drm: "locked", store: "Amazon Kindle" },
  ];

  const handleToggleStore = (id: number) => {
    setStores(stores.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const handleSelectAll = () => {
    setStores(stores.map(s => ({ ...s, checked: true })));
  };

  const handleSelectNone = () => {
    setStores(stores.map(s => ({ ...s, checked: false })));
  };

  const handleInvert = () => {
    setStores(stores.map(s => ({ ...s, checked: !s.checked })));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs">
      <div className="bg-[#f8fafc] dark:bg-zinc-950 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-[#f8fafc] dark:bg-zinc-950 rounded-t-2xl border-b border-zinc-100 dark:border-zinc-800/50">
          <h2 className="text-3xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Get Books</h2>
          <button 
            onClick={onClose} 
            className="text-[#1e293b] dark:text-zinc-300 font-bold hover:opacity-70 transition-opacity text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Section 1: General Search Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50 pb-3">
              <div className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-100">
                <div className="w-8 h-8 rounded-lg bg-[#EAEFF5] dark:bg-zinc-800 flex items-center justify-center text-[#1b2e3c] dark:text-[#E5C39C]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">General Search</h3>
              </div>
              <Button 
                onClick={() => alert(`Searching for Title: "${bookTitle}"`)}
                className="bg-[#1b2e3c] hover:bg-[#13212c] text-white px-5 py-2 rounded-lg font-bold shadow-none text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </Button>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Book Title
                </label>
                <input 
                  type="text" 
                  value={bookTitle} 
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 font-medium focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Author
                </label>
                <input 
                  type="text" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 font-medium focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Keyword
                </label>
                <input 
                  type="text" 
                  value={keyword} 
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 font-medium focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Stores & Results Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Box - Stores Checklist */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-[#1e293b] dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <Store className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <h3 className="font-bold text-base font-serif">Stores</h3>
              </div>

              {/* Scrollable checklists */}
              <div className="flex-1 max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-2.5">
                {stores.map(store => (
                  <label key={store.id} className="flex items-center gap-2.5 cursor-pointer text-sm text-zinc-600 dark:text-zinc-400 select-none hover:text-zinc-800 dark:hover:text-zinc-200">
                    <input 
                      type="checkbox" 
                      checked={store.checked} 
                      onChange={() => handleToggleStore(store.id)}
                      className="rounded border-zinc-300 dark:border-zinc-700 text-[#1b2e3c] focus:ring-[#1b2e3c] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-semibold text-zinc-600 dark:text-zinc-400 text-xs">
                      {store.name}
                    </span>
                  </label>
                ))}
              </div>

              {/* Action buttons footer */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                <Button 
                  onClick={handleSelectAll} 
                  variant="outline" 
                  className="w-full text-xs font-bold py-1.5 h-auto rounded-full border-zinc-200 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Select All
                </Button>
                <Button 
                  onClick={handleInvert} 
                  variant="outline" 
                  className="w-full text-xs font-bold py-1.5 h-auto rounded-full border-zinc-200 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Invert Selection
                </Button>
                <Button 
                  onClick={handleSelectNone} 
                  variant="outline" 
                  className="w-full text-xs font-bold py-1.5 h-auto rounded-full border-zinc-200 dark:border-zinc-700 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Select None
                </Button>
              </div>
            </div>

            {/* Right Box - Query Results Table */}
            <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-xl p-5 shadow-xs flex flex-col gap-4 overflow-x-auto">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Search Results</span>
                
                {/* Badges sort/filter */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#f1f5f9] dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <span>Sort by</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-1 bg-[#f1f5f9] dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <span>Filter by</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-zinc-600 dark:text-zinc-400">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">Cover</th>
                      <th className="py-3 px-4 font-bold">Title</th>
                      <th className="py-3 px-4 font-bold">Price</th>
                      <th className="py-3 px-4 font-bold text-center">DRM</th>
                      <th className="py-3 px-4 font-bold">Store</th>
                      <th className="py-3 px-4 font-bold text-center">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {results.map(row => (
                      <tr key={row.id} className="hover:bg-zinc-50/55 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-10 h-14 bg-[#dbeafe] dark:bg-blue-900/20 rounded-md border border-zinc-200 dark:border-zinc-800 flex-shrink-0" />
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-800 dark:text-zinc-200 font-serif">
                          {row.title}
                        </td>
                        <td className="py-3 px-4 font-semibold text-zinc-600 dark:text-zinc-400">
                          {row.price}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            {row.drm === "locked" ? (
                              <div className="w-8 h-8 rounded-lg bg-[#EAEFF5] dark:bg-zinc-800 flex items-center justify-center text-[#1b2e3c] dark:text-[#E5C39C]" title="Locked DRM">
                                <Lock className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-[#EAEFF5] dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400" title="Unlocked DRM">
                                <Unlock className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-[180px]">
                          {row.store}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button 
                            onClick={() => alert(`Starting download for ${row.title} from ${row.store}`)}
                            className="w-8 h-8 rounded-lg bg-[#EAEFF5] dark:bg-zinc-800 hover:bg-[#1b2e3c] hover:text-white dark:hover:bg-[#E5C39C] dark:hover:text-black flex items-center justify-center text-[#1b2e3c] dark:text-[#E5C39C] transition-all cursor-pointer border-0 mx-auto"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
