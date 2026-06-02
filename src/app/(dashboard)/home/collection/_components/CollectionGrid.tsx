import Link from "next/link";
import { Star } from "lucide-react";

export interface BookItem {
  id?: string;
  title: string;
  author: string;
  format: string;
  rating: number;
}

interface CollectionGridProps {
  books: BookItem[];
}

export default function CollectionGrid({ books }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {books.map((book, index) => {
        const coverUrl = book.id ? `/api/cover?id=${book.id}` : "";
        return (
          <Link
            key={book.id || index}
            href={book.id ? `/home/book?id=${book.id}` : "/home/book"}
            className="flex flex-col group cursor-pointer"
          >
            <div className="w-full aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-3 relative flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1 border border-zinc-200 dark:border-zinc-800">
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
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
                <Star key={i} className={`w-4 h-4 ${i < Math.round(book.rating) ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
              ))}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
