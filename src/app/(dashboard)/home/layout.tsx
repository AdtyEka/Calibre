import { SidebarProvider } from "@/components/ui/sidebar";
import HomeSidebar from "@/components/home-sidebar";
import Footer from "@/components/layouts/footer";
import HeadSidebar from "@/components/head-sidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SidebarProvider>
        <HomeSidebar />
        <main className="flex flex-1 w-full flex-col bg-white dark:bg-black pb-[60px]">
          <HeadSidebar />
          {children}
        </main>
      </SidebarProvider>
      <Footer />
    </div>
  );
}
