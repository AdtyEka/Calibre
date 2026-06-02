"use client";

import React, { useState, useEffect } from "react";
import { Plus, ChevronDown, LayoutGrid, List, ChevronRight, ExternalLink, Copy, FolderOpen, Check, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CollectionGrid from "./_components/CollectionGrid";
import Link from "next/link";

interface BookData {
  id: string;
  title: string;
  author: string;
  authors: string[];
  format: string;
  formats: string[];
  rating: number;
  size: number;
  timestamp: string;
  last_modified: string;
}

interface Collection {
  id: string;
  name: string;
  bookCount: number;
  books: BookData[];
}

export default function CollectionPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOption, setSortOption] = useState("count");
  const [totalBooks, setTotalBooks] = useState(0);

  // Fetch collections from backend
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/calibre/collections");
        if (!res.ok) throw new Error("Failed to fetch collections");
        const data = await res.json();
        setCollections(data.collections || []);
        setTotalBooks(data.totalBooks || 0);
      } catch (err: any) {
        console.error("Error loading collections:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Sort collections
  const sortedCollections = React.useMemo(() => {
    const copy = [...collections];
    switch (sortOption) {
      case "name":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "count":
      default:
        return copy.sort((a, b) => b.bookCount - a.bookCount);
    }
  }, [collections, sortOption]);

  // Get top books from all collections (for the header grid)
  const topBooks = React.useMemo(() => {
    const allBooks = new Map<string, BookData>();
    for (const col of collections) {
      for (const book of col.books) {
        if (!allBooks.has(book.id)) {
          allBooks.set(book.id, book);
        }
      }
    }
    // Sort by rating, take top 5
    return Array.from(allBooks.values())
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  }, [collections]);

  // Color palette for collection cards
  const collectionColors = [
    "from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-900/40",
    "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-900/40",
    "from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-900/40",
    "from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-900/40",
    "from-rose-500/10 to-red-500/10 border-rose-200 dark:border-rose-900/40",
    "from-cyan-500/10 to-sky-500/10 border-cyan-200 dark:border-cyan-900/40",
  ];

  const tagColors = [
    "text-blue-600 dark:text-blue-400",
    "text-emerald-600 dark:text-emerald-400",
    "text-amber-600 dark:text-amber-400",
    "text-purple-600 dark:text-purple-400",
    "text-rose-600 dark:text-rose-400",
    "text-cyan-600 dark:text-cyan-400",
  ];

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <p className="text-zinc-500 font-medium text-sm">Memuat koleksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500 font-bold">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 p-8 flex flex-col gap-8 relative bg-white dark:bg-zinc-950 min-h-screen">
        {selectedCollection ? (
          /* Collection Detail View — shows books in the selected tag/collection */
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
              <button
                onClick={() => setSelectedCollection(null)}
                className="hover:text-zinc-700 dark:hover:text-zinc-300 font-medium transition-colors cursor-pointer"
              >
                Collections
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-zinc-600 dark:text-zinc-300 font-medium">{selectedCollection.name}</span>
            </div>

            {/* Collection Header */}
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg flex items-center justify-center bg-zinc-900">
                <div className="absolute inset-0 bg-radial from-zinc-700 to-zinc-950 opacity-80" />
                <Tag className="w-6 h-6 text-zinc-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 z-20 pointer-events-none" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold font-serif text-zinc-900 dark:text-white tracking-tight leading-tight">
                  {selectedCollection.name}
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  {selectedCollection.bookCount} {selectedCollection.bookCount === 1 ? "book" : "books"} in this collection
                </p>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4">
              {selectedCollection.books.map(book => {
                const coverUrl = `/api/cover?id=${book.id}`;
                return (
                  <Link
                    key={book.id}
                    href={`/home/book?id=${book.id}`}
                    className="flex flex-col group cursor-pointer"
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
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          /* Main Collections List View */
          <>
            <h1 className="text-4xl font-bold font-serif mb-2 text-zinc-900 dark:text-white">Your Collections</h1>

            {/* Top Rated Books Grid */}
            {topBooks.length > 0 && (
              <CollectionGrid books={topBooks.map(b => ({
                id: b.id,
                title: b.title,
                author: b.author,
                format: b.format,
                rating: b.rating,
              }))} />
            )}

            {/* Collections Section */}
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white">Tags & Collections</h2>
                  <p className="text-sm text-zinc-500 mt-1">Books grouped by their Calibre tags</p>
                  <p className="text-sm text-zinc-500">{collections.length} collections • {totalBooks} total books</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Controls */}
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg text-sm">
                    <span className="text-zinc-500 px-2">Sort by:</span>
                    <select
                      value={sortOption}
                      onChange={e => setSortOption(e.target.value)}
                      className="bg-transparent border-none focus:outline-none text-zinc-900 dark:text-zinc-100 font-medium text-sm"
                    >
                      <option value="count">Book Count</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Collections Grid */}
              {sortedCollections.length === 0 ? (
                <div className="flex justify-center py-16 text-zinc-500 text-sm font-medium">
                  Tidak ada koleksi. Tambahkan tag pada buku di Calibre untuk membuat koleksi.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedCollections.map((collection, index) => {
                    const colorIdx = index % collectionColors.length;
                    return (
                      <Card
                        key={collection.id}
                        onClick={() => setSelectedCollection(collection)}
                        className={`p-5 border rounded-xl bg-gradient-to-br ${collectionColors[colorIdx]} dark:bg-zinc-950 shadow-none cursor-pointer hover:shadow-md transition-all duration-250 group flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className={`w-4 h-4 ${tagColors[colorIdx]}`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${tagColors[colorIdx]}`}>
                              {collection.id === "__untagged__" ? "UNCATEGORIZED" : "TAG"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold font-serif mb-1 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {collection.name}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                            {collection.bookCount} {collection.bookCount === 1 ? "book" : "books"}
                          </p>
                          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5 transform duration-200" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}