import Link from "next/link";
import { Star } from "lucide-react";

export interface BookItem {
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
      {books.map((book, index) => (
        <Link key={index} href="/home/book" className="flex flex-col items-center text-center group cursor-pointer">
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
  );
}
