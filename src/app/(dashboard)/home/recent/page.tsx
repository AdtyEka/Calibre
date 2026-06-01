"use client";

import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useBookPreview } from "@/components/providers/book-preview-context";

export default function Recent() {
  const { setHoveredBook, hoveredBook } = useBookPreview();

  const books = [
    { title: "The Hunger Games", author: "Suzanne Collins", format: "EPUB", rating: 4 },
    { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", format: "PDF", rating: 3 },
    { title: "The Metamorphosis", author: "Franz Kafka", format: "AZW3", rating: 4 },
    { title: "Laut Bercerita", author: "Leila S. Chudori", format: "DOCX", rating: 4 },
    { title: "Dune", author: "Frank Herbert", format: "TXT", rating: 3 },
  ];

  return (
    <div className="flex-1 p-8 flex flex-col gap-8 relative">
            <div>
              <h2 className="text-xl font-bold font-serif mb-4">Recently Uploaded</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {books.map((book, index) => (
                  <Link 
                    key={index} 
                    href="/home/book" 
                    className="flex flex-col items-center text-center group cursor-pointer"
                    onMouseEnter={() => setHoveredBook({
                      title: book.title,
                      author: book.author,
                      format: book.format
                    })}
                    onMouseLeave={() => setHoveredBook(null)}
                  >
                    <div className="w-full aspect-[3/4] bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3 relative flex items-center justify-center transition-transform group-hover:-translate-y-1">
                      <span className="absolute top-2 right-2 bg-zinc-800/20 dark:bg-zinc-100/20 text-xs font-bold px-1.5 py-0.5 rounded">{book.format}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-0.5 font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{book.title}</h3>
                    <p className="text-xs text-zinc-500">{book.author}</p>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < book.rating ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold font-serif mb-4">Recently Opened</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {books.map((book, index) => (
                  <Link 
                    key={index} 
                    href="/home/book" 
                    className="flex flex-col items-center text-center group cursor-pointer"
                    onMouseEnter={() => setHoveredBook({
                      title: book.title,
                      author: book.author,
                      format: book.format
                    })}
                    onMouseLeave={() => setHoveredBook(null)}
                  >
                    <div className="w-full aspect-[3/4] bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3 relative flex items-center justify-center transition-transform group-hover:-translate-y-1">
                      <span className="absolute top-2 right-2 bg-zinc-800/20 dark:bg-zinc-100/20 text-xs font-bold px-1.5 py-0.5 rounded">{book.format}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-0.5 font-serif group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{book.title}</h3>
                    <p className="text-xs text-zinc-500">{book.author}</p>
                    <div className="flex justify-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < book.rating ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              href="/home/convert"
              className={`fixed bottom-20 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out z-50 p-0 ${
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