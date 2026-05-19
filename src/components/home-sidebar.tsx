"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Book, Settings, Home, Library, LogOut, Search, Bookmark, Folder, LifeBuoy } from "lucide-react"


// Menu items.
const items = [
  {
    title: "Library",
    url: "/home/library",
    icon: Library,
  },
  {
    title: "Recents",
    url: "/home/recent",
    icon: Bookmark,
  },
  {
    title: "Collection",
    url: "/home/collection",
    icon: Folder,
  },
  {
    title: "Settings",
    url: "/home/settings",
    icon: Settings,
  },
  {
    title: "Supports",
    url: "/home/support",
    icon: LifeBuoy,
  },
]

export default function HomeSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEditing = pathname?.includes("/book/edit") ?? false;
  const exitUrl = isEditing ? "/home/book" : "/home/library";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 font-bold text-3xl px-2 py-2">
          <span>Calibre Web</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md font-semibold mb-2">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = mounted && (
                  pathname === item.url 
                  || (item.url !== '/' && (pathname?.startsWith(item.url) ?? false))
                  || (item.url === '/home/library' && ((pathname?.includes('/book') ?? false) || (pathname?.includes('/convert') ?? false)))
                );
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      render={<a href={item.url} />} 
                      className={`text-lg py-5 px-3 relative overflow-hidden transition-colors ${
                        isActive 
                          ? 'bg-[#e0f2fe] dark:bg-blue-900/30 text-[#1e293b] dark:text-white hover:bg-[#e0f2fe] dark:hover:bg-blue-900/30' 
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-[5px] rounded-r-md bg-[#1e293b] dark:bg-zinc-100" />
                      )}
                      <item.icon className="w-6 h-6 mr-1" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 pb-[76px]">
        <a href={exitUrl} className="w-full bg-[#D12B47] hover:bg-[#B5243C] text-white flex items-center justify-center gap-2 rounded-md py-3 text-base font-medium transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Exit</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  )
}