"use client";

import { useState, useEffect, useMemo } from "react";
import { LayoutGrid, List, Plus, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export default function Library() {
  const { setHoveredBook, hoveredBook } = useBookPreview();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>("date_added");

  // Fetch books from Calibre API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/calibre");
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        if (data.metadata) {
          const list: Book[] = Object.keys(data.metadata).map(id => {
            const b = data.metadata[id];
            return {
              id,
              title: b.title || "Unknown Title",
              author: b.authors ? b.authors.join(", ") : "Unknown Author",
              format: b.formats && b.formats.length > 0 ? b.formats[0] : "EPUB",
              rating: b.rating || 0,
              timestamp: b.timestamp || "",
              last_modified: b.last_modified || "",
              description: b.comments || ""
            };
          });
          setBooks(list);
        }
      } catch (e) {
        console.error("Error loading books", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Sorted list based on user selection
  const sortedBooks = useMemo(() => {
    const copy = [...books];
    switch (sortOption) {
      case "title":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "author":
        return copy.sort((a, b) => a.author.localeCompare(b.author));
      case "rating":
        return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "date_added":
      default:
        return copy.sort((a, b) => {
          const at = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const bt = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return bt - at;
        });
    }
  }, [books, sortOption]);

  return (
    <>
      <div className="flex-1 p-8 flex flex-col gap-8 relative">
        {/* Header with sorting controls */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold font-serif">Your Virtual Library</h2>
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg text-sm">
            <span className="text-zinc-500">Sort by:</span>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-zinc-900 dark:text-zinc-100"
            >
              <option value="date_added">Date Added</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
            </select>
            <div className="w-[1px] bg-zinc-200 dark:bg-zinc-800 h-6" />
            <Button className="h-auto p-1.5 bg-[#2C3E50] dark:bg-zinc-800 rounded-md shadow-xs">
              <LayoutGrid className="w-4 h-4 text-white" />
            </Button>
            <Button className="h-auto p-1.5 bg-transparent text-zinc-500">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Book grid */}
        {isLoading ? (
          <div className="flex justify-center py-10 w-full text-zinc-500 text-sm font-medium">
            Memuat koleksi buku...
          </div>
        ) : sortedBooks.length === 0 ? (
          <div className="flex justify-center py-10 w-full text-zinc-500 text-sm font-medium">
            Tidak ada buku di perpustakaan.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {sortedBooks.map(book => {
              const coverUrl = `/api/cover?id=${book.id}`;
              return (
                <Link
                  key={book.id}
                  href={`/home/book?id=${book.id}`}
                  className="flex flex-col group cursor-pointer"
                  onMouseEnter={() => setHoveredBook({ title: book.title, author: book.author, format: book.format, coverUrl, rating: book.rating, description: book.description })}
                  onMouseLeave={() => setHoveredBook(null)}
                  onClick={() => setHoveredBook(null)}
                >
                  <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-3 relative flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 border border-zinc-200 dark:border-zinc-800">
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-black/60 dark:bg-white/80 text-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded z-10 backdrop-blur-sm">
                      {book.format}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-0.5 font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1" title={book.author}>
                    {book.author}
                  </p>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(book.rating) ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`}
                      />
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Floating add button */}
        <Link
          href="/home/convert"
          className={`fixed bottom-20 bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out z-50 p-0 ${hoveredBook ? "right-[262px] lg:right-[312px]" : "right-8"}`}
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </>
  );
}