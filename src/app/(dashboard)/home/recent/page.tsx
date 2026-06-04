"use client";

import { useEffect, useState } from "react";
import { Plus, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useBookPreview } from "@/components/providers/book-preview-context";

interface Book {
  id: string;
  title: string;
  author: string;
  format: string;
  rating: number;
  timestamp: string;
  last_modified: string;
  description?: string;
}

export default function Recent() {
  const { setHoveredBook, hoveredBook } = useBookPreview();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/calibre");
        const data = await res.json();
        
        if (data.metadata) {
          const booksArray: Book[] = Object.keys(data.metadata).map(id => {
            const b = data.metadata[id];
            return {
              id: String(b.id),
              title: b.title || "Unknown Title",
              author: b.authors ? b.authors.join(", ") : "Unknown Author",
              format: b.formats && b.formats.length > 0 ? b.formats[0] : "EPUB",
              rating: b.rating || 0,
              timestamp: b.timestamp || new Date().toISOString(),
              last_modified: b.last_modified || new Date().toISOString(),
              description: b.comments || ""
            };
          });
          setBooks(booksArray);
        }
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Sort by Uploaded (timestamp descending)
  const recentUploaded = [...books].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  }).slice(0, 5); // Ambil 5 teratas

  // Sort by Last Modified / Opened (last_modified descending)
  const recentOpened = [...books].sort((a, b) => {
    return new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime();
  }).slice(0, 5); // Ambil 5 teratas

  const renderBookGrid = (bookList: Book[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12 w-full">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      );
    }
    
    if (bookList.length === 0) {
      return <div className="text-sm text-zinc-500 py-4">Belum ada buku dalam kategori ini.</div>;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {bookList.map((book) => {
          const coverUrl = `/api/cover?id=${book.id}`;
          return (
            <Link 
              key={book.id} 
              href={`/home/book?id=${book.id}`} 
              className="flex flex-col group cursor-pointer"
              onMouseEnter={() => setHoveredBook({
                title: book.title,
                author: book.author,
                format: book.format,
                coverUrl: coverUrl,
                rating: book.rating,
                description: book.description
              })}
              onMouseLeave={() => setHoveredBook(null)}
            >
              <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-3 relative flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 border border-zinc-200 dark:border-zinc-800">
                <img 
                  src={coverUrl} 
                  alt={book.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { 
                    e.currentTarget.style.display = 'none';
                    // Tampilkan kotak placeholder jika gambar gagal dimuat
                    e.currentTarget.parentElement!.classList.add('bg-blue-100', 'dark:bg-blue-900/30');
                  }} 
                />
                <span className="absolute top-2 right-2 bg-black/60 dark:bg-white/80 text-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded z-10 backdrop-blur-sm">{book.format}</span>
              </div>
              <h3 className="font-bold text-sm mb-0.5 font-serif text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{book.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{book.author}</p>
              <div className="flex gap-0.5 mt-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(book.rating / 2) ? "text-amber-500 fill-amber-500" : "text-zinc-300 dark:text-zinc-700"}`} />
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 flex flex-col gap-10 relative">
      <div>
        <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white mb-6">Recently Uploaded</h2>
        {renderBookGrid(recentUploaded)}
      </div>

      <div>
        <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white mb-6">Recently Modified / Opened</h2>
        {renderBookGrid(recentOpened)}
      </div>

      <Link 
        href="/home/convert"
        className={`fixed bottom-20 bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out z-50 p-0 ${
          hoveredBook 
            ? "right-[262px] lg:right-[312px]" 
            : "right-8"
        }`}
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}