"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ReactReader } from "react-reader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookReaderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get("id");
  
  const [location, setLocation] = useState<string | number>(0);
  const [isClient, setIsClient] = useState(false);
  const [percentage, setPercentage] = useState<number | null>(null);
  
  // Stable cache buster: generated once per page load, not on every render
  const [cacheBuster] = useState(() => Date.now());
  const epubUrl = bookId ? `/api/download?bookId=${bookId}&format=EPUB&t=${cacheBuster}` : "";

  useEffect(() => {
    setIsClient(true);
    if (bookId) {
      const savedLoc = localStorage.getItem(`calibre-reader-loc-${bookId}`);
      if (savedLoc) {
        setLocation(savedLoc);
      }
      const savedPct = localStorage.getItem(`calibre-reader-pct-${bookId}`);
      if (savedPct) {
        setPercentage(parseInt(savedPct, 10));
      }
    }
  }, [bookId]);

  const locationChanged = (epubcifi: string) => {
    setLocation(epubcifi);
    if (bookId) {
      localStorage.setItem(`calibre-reader-loc-${bookId}`, epubcifi);
    }
  };

  if (!isClient) return <div className="h-screen bg-white dark:bg-[#121212]" />;

  if (!bookId) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-[#121212] flex-col gap-4">
        <p className="text-xl dark:text-white">ID Buku tidak valid.</p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative bg-white dark:bg-[#121212] flex flex-col">
      {/* Header Bar */}
      <div className="h-14 flex items-center justify-between px-4 border-b dark:border-zinc-800 bg-white dark:bg-[#1e1e1e] flex-shrink-0 z-10">
        <Link href={`/home/book?id=${bookId}`}>
          <Button variant="ghost" size="sm" className="gap-2 text-zinc-600 dark:text-zinc-300">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Detail Buku
          </Button>
        </Link>
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {percentage !== null ? `${percentage}% Complete` : "Menghitung halaman..."}
        </div>
      </div>
      
      {/* Reader Area */}
      <div className="flex-1 relative">
        <ReactReader
          url={epubUrl}
          location={location}
          locationChanged={locationChanged}
          getRendition={(rendition) => {
            const book = rendition.book;
            
            // Generate locations for percentage calculation
            book.ready.then(() => {
              return book.locations.generate(1600);
            }).then((locations) => {
              // Locations generated successfully
            }).catch(console.error);

            rendition.on("relocated", (loc: any) => {
              if (book.locations.length() > 0) {
                const fraction = book.locations.percentageFromCfi(loc.start.cfi);
                const pct = Math.round(fraction * 100);
                setPercentage(pct);
                localStorage.setItem(`calibre-reader-pct-${bookId}`, pct.toString());
              }
            });
            // Handle themes for dark mode if needed
            rendition.themes.default({
              "body": { "background": "transparent !important" }
            });
          }}
          epubInitOptions={{
            openAs: 'epub'
          }}
        />
      </div>
    </div>
  );
}
