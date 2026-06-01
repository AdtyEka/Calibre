"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import HomeSidebar from "@/components/home-sidebar";
import Footer from "@/components/layouts/footer";
import HeadSidebar from "@/components/head-sidebar";
import { BookPreviewProvider, useBookPreview } from "@/components/providers/book-preview-context";
import BookPreviewSidebar from "@/components/book-preview-sidebar";

function MainContent({ children }: { children: React.ReactNode }) {
  const { hoveredBook } = useBookPreview();

  return (
    <div className="flex flex-1 w-full flex-col bg-white dark:bg-black pb-[60px]">
      <HeadSidebar />
      <main
        className={`flex-1 w-full flex flex-col transition-all duration-300 ease-in-out ${
          hoveredBook ? "md:pr-[230px] lg:pr-[280px]" : "pr-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <BookPreviewProvider>
          <HomeSidebar />
          <div className="flex flex-1 w-full relative overflow-hidden">
            <MainContent>{children}</MainContent>
            <BookPreviewSidebar />
          </div>
        </BookPreviewProvider>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
