"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, List, Plus, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useBookPreview } from "@/components/providers/book-preview-context";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [libraryId, setLibraryId] = useState<string>("Calibre_Library");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/calibre");
        if (!res.ok) throw new Error("Gagal fetch data");
        const data = await res.json();
        
        if (data.metadata) {
          const booksArray = Object.keys(data.metadata).map(id => {
            const b = data.metadata[id];
            return {
              id: id,
              title: b.title || "Unknown Title",
              author: b.authors ? b.authors.join(", ") : "Unknown Author",
              format: b.formats ? b.formats[0] : "EPUB",
            };
          });
          setBooks(booksArray);
          setLibraryId(data.library_id || "Calibre_Library");
        }
      } catch (error) {
        console.error("Gagal mengambil daftar buku:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooks();
  }, []);

  return (
    <>
      <div className="flex-1 p-8 flex flex-col gap-8 relative">
        {/* Continue Reading Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 font-serif">Continue Reading</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1 */}
            <Link href="/home/book" className="block transition-transform hover:-translate-y-1">
              <Card className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex gap-6 bg-white dark:bg-zinc-950 shadow-none h-full">
                <div className="w-32 h-44 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center relative flex-shrink-0">
                  <span className="absolute top-2 right-2 bg-zinc-800/20 dark:bg-zinc-100/20 text-xs font-bold px-1.5 py-0.5 rounded">PDF</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase text-zinc-500 mb-1">Fiction</span>
                  <h3 className="text-xl font-bold font-serif mb-1">A Dance with Dragons</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">George R. R. Martin</p>
                  <div className="flex justify-start gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>78% Complete</span>
                      <span>Page 823 of 1,056</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <Button className="h-auto w-full bg-[#243342] hover:bg-[#1B2631] text-white text-sm font-medium py-2 rounded-lg transition-colors pointer-events-none">
                      Resume Reading
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Card 2 */}
            <Link href="/home/book" className="block transition-transform hover:-translate-y-1">
              <Card className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex gap-6 bg-white dark:bg-zinc-950 shadow-none h-full">
                <div className="w-32 h-44 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center relative flex-shrink-0">
                  <span className="absolute top-2 right-2 bg-zinc-800/20 dark:bg-zinc-100/20 text-xs font-bold px-1.5 py-0.5 rounded">EPUB</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase text-zinc-500 mb-1">Sci-Fi</span>
                  <h3 className="text-xl font-bold font-serif mb-1">Hail Mary</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Andy Weir</p>
                  <div className="flex justify-start gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span>12% Complete</span>
                      <span>Page 59 of 496</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                    <Button className="h-auto w-full bg-[#243342] hover:bg-[#1B2631] text-white text-sm font-medium py-2 rounded-lg transition-colors pointer-events-none">
                      Resume Reading
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Your Virtual Library Section */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold font-serif">Your Virtual Library</h2>
              <p className="text-sm text-zinc-500 mt-1">{books.length} Books in Archive</p>
            </div>

            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg text-sm">
              <div className="flex items-center gap-1 px-3 py-1.5">
                <span className="text-zinc-500">Sort by:</span>
                <Button className="h-auto p-0 bg-transparent font-medium flex items-center gap-1 text-zinc-900 dark:text-zinc-100">
                  Date Added <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
              <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800 h-6" />
              <Button className="h-auto p-1.5 bg-[#2C3E50] dark:bg-zinc-800 rounded-md shadow-xs">
                <LayoutGrid className="w-4 h-4 text-white" />
              </Button>
              <Button className="h-auto p-1.5 bg-transparent text-zinc-500">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Book Grid using map */}
          {isLoading ? (
            <div className="flex justify-center py-10 w-full text-zinc-500 text-sm font-medium">Memuat koleksi buku...</div>
          ) : books.length === 0 ? (
            <div className="flex justify-center py-10 w-full text-zinc-500 text-sm font-medium">Tidak ada buku di perpustakaan.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book) => {
                const coverUrl = `http://127.0.0.1:8081/get/cover/${book.id}/${libraryId}`;
                return (
                  <Link key={book.id} href={`/home/book?id=${book.id}`} className="flex flex-col group cursor-pointer">
                    <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-3 relative flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 border border-zinc-200 dark:border-zinc-800">
                      <span className="absolute top-2 right-2 bg-black/60 dark:bg-white/80 text-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded z-10 backdrop-blur-sm">{book.format}</span>
                      <img src={coverUrl} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    </div>
                    <h3 className="font-bold text-sm mb-0.5 font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1" title={book.title}>{book.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-1" title={book.author}>{book.author}</p>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Button className="h-auto bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium px-6 py-2.5 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
              Load More Titles
            </Button>
          </div>
        </div>

        <Button className="fixed bottom-20 right-8 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors z-50 p-0">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
}