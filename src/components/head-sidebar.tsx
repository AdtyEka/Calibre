"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, RefreshCw, CloudCheck, ChevronDown, ChevronRight, Globe, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GetBooksModal from "./GetBooksModal";
import ConnectModal from "./ConnectModal";

export default function HeadSidebar() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGetBooksOpen, setIsGetBooksOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  let title = "Dashboard";
  
  if (pathname.includes("/library") || pathname.includes("/book") || pathname.includes("/convert") || pathname.includes("/folder")) title = "Library";
  else if (pathname.includes("/recent")) title = "Recent";
  else if (pathname.includes("/collection")) title = "Collections";
  else if (pathname.includes("/support")) title = "Support";
  else if (pathname.includes("/settings")) title = "Settings";

  return (
    <div className="grid grid-cols-3 items-center px-8 py-5 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-4 justify-self-start">
        <SidebarTrigger />
        <span className="font-bold text-2xl">{title}</span>
      </div>

      <div className="justify-self-center w-full max-w-xl hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <Input type="text" placeholder="Search" className="h-auto w-full pl-11 pr-4 py-2.5 bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-full text-base focus:outline-none focus:ring-1 focus:ring-zinc-400" />
        </div>
      </div>

      <div className="flex items-center gap-6 justify-self-end">
        <Button className="h-auto p-0 bg-transparent text-zinc-700 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors hover:bg-transparent shadow-none">
          <RefreshCw className="w-[22px] h-[22px]" />
        </Button>
        <Button className="h-auto p-0 bg-transparent text-zinc-700 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors hover:bg-transparent shadow-none">
          <CloudCheck className="w-[22px] h-[22px]" />
        </Button>
        <Link href="/home/convert" className="font-bold text-base text-zinc-800 hover:text-black dark:text-zinc-300 dark:hover:text-white transition-colors">
          Convert
        </Link>
        
        {/* Dropdown Container */}
        <div className="relative">
          {/* Click-outside backdrop overlay */}
          {isDropdownOpen && (
            <div 
              className="fixed inset-0 z-40 bg-transparent" 
              onClick={() => setIsDropdownOpen(false)}
            />
          )}

          {/* Trigger split-capsule button */}
          <div className="relative z-50 flex items-center gap-[3px] text-white text-base font-medium">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group bg-[#1e293b] hover:bg-[#2C3E50] dark:bg-zinc-900 dark:hover:bg-zinc-800 px-4.5 py-2.5 rounded-l-full rounded-r-[4px] transition-colors cursor-pointer shadow-sm flex items-center justify-center h-[38px]"
            >
              <div className="relative flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
                <div className="absolute -bottom-1 -right-1 bg-[#1e293b] dark:bg-zinc-900 group-hover:bg-[#2C3E50] dark:group-hover:bg-zinc-800 rounded-full p-[1px] flex items-center justify-center transition-colors">
                  <Plus className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              </div>
            </button>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-[#1e293b] hover:bg-[#2C3E50] dark:bg-zinc-900 dark:hover:bg-zinc-800 px-3.5 py-2.5 rounded-r-full rounded-l-[4px] flex items-center justify-center transition-colors cursor-pointer shadow-sm h-[38px]"
            >
              <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Stacked Split Pill Dropdown Option List */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-[54px] z-50 flex flex-col gap-2 items-end animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Row 1: Get Books */}
              <div className="flex items-center gap-[3px] text-white text-sm font-semibold">
                <button 
                  onClick={() => {
                    setIsGetBooksOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="bg-[#1e293b] hover:bg-[#2C3E50] dark:bg-zinc-900 dark:hover:bg-zinc-800 w-[110px] py-2.5 rounded-l-full rounded-r-[4px] transition-colors cursor-pointer shadow-sm text-sm whitespace-nowrap text-center"
                >
                  Get Books
                </button>
                <button 
                  onClick={() => {
                    setIsGetBooksOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="bg-[#1e293b] hover:bg-[#2C3E50] dark:bg-zinc-900 dark:hover:bg-zinc-800 px-3.5 py-2.5 rounded-r-full rounded-l-[4px] transition-colors cursor-pointer flex items-center justify-center shadow-sm h-[38px]"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Row 2: Connect */}
              <div className="flex items-center gap-[3px] text-white text-sm font-semibold">
                <button 
                  onClick={() => {
                    setIsConnectOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="bg-[#1e293b] hover:bg-[#2C3E50] dark:bg-zinc-900 dark:hover:bg-zinc-800 w-[110px] py-2.5 rounded-l-full rounded-r-[4px] transition-colors cursor-pointer shadow-sm text-sm whitespace-nowrap text-center"
                >
                  Connect
                </button>
                <button 
                  onClick={() => {
                    setIsConnectOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="bg-[#1e293b] hover:bg-[#2C3E50] dark:bg-zinc-900 dark:hover:bg-zinc-800 px-3.5 py-2.5 rounded-r-full rounded-l-[4px] transition-colors cursor-pointer flex items-center justify-center shadow-sm h-[38px]"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Get Books Modal popup overlay */}
      <GetBooksModal 
        isOpen={isGetBooksOpen} 
        onClose={() => setIsGetBooksOpen(false)} 
      />

      {/* Connect Modal popup overlay */}
      <ConnectModal
        isOpen={isConnectOpen}
        onClose={() => setIsConnectOpen(false)}
      />
    </div>
  );
}
