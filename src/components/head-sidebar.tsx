"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, RefreshCw, Cloud, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HeadSidebar() {
  const pathname = usePathname();
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
        <Button className="h-auto p-0 bg-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
          <RefreshCw className="w-6 h-6" />
        </Button>
        <Button className="h-auto p-0 bg-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
          <Cloud className="w-6 h-6" />
        </Button>
        <Link href="/home/convert" className="font-medium text-base text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors">
          Convert
        </Link>
        
        <div className="flex items-center rounded-md overflow-hidden bg-[#243342] text-white text-base font-medium">
          <Button className="h-auto hover:bg-[#1B2631] px-5 py-2.5 transition-colors bg-transparent rounded-none">
            Add
          </Button>
          <div className="w-[1px] bg-white/20 h-6" />
          <Button className="h-auto hover:bg-[#1B2631] px-3 py-2.5 flex items-center justify-center transition-colors bg-transparent rounded-none">
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
