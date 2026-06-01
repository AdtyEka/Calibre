"use client";

import { Info, Leaf, Target, VenetianMask, Star, X, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface BookMetadataFormProps {
  book: any;
  onChange?: (fields: any) => void;
}

export default function BookMetadataForm({ book, onChange }: BookMetadataFormProps) {
  // Local state to manage form fields (derived from book prop)
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [series, setSeries] = useState("");
  const [seriesIndex, setSeriesIndex] = useState("1");
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");

  // Sync state dengan book prop
  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.authors ? book.authors.join(", ") : "");
      setSeries(book.series || "");
      setSeriesIndex(book.series_index ? String(book.series_index) : "1");
      
      const rawRating = book.rating || 0;
      setRating(rawRating > 5 ? Math.round(rawRating / 2) : rawRating);
      
      setTags(book.tags || []);
      
      // Ambil ISBN dari identifiers
      const isbnVal = book.identifiers?.isbn || book.identifiers?.isbn13 || "";
      setIsbn(isbnVal);
      
      setPublisher(book.publisher || "");
      
      // Format tanggal publikasi "YYYY-MM-DD" untuk input type="date"
      if (book.pubdate) {
        try {
          const date = new Date(book.pubdate);
          setPubDate(date.toISOString().split('T')[0]);
        } catch (e) {
          setPubDate("");
        }
      } else {
        setPubDate("");
      }
      
      const langCode = book.languages?.[0] || "eng";
      setLanguage(langCode === "ind" ? "Indonesian" : "English");
      
      // Bersihkan tag HTML dari comments untuk textarea
      const rawDesc = book.comments || "";
      const strippedDesc = rawDesc.replace(/<[^>]*>/g, "");
      setDescription(strippedDesc);
    }
  }, [book]);

  // Mengirimkan perubahan ke parent component setiap kali ada input yang berubah
  useEffect(() => {
    if (onChange && book) {
      onChange({
        title,
        authors: author.split(",").map((s) => s.trim()).filter(Boolean),
        series,
        series_index: parseFloat(seriesIndex) || 1,
        rating,
        tags,
        identifiers: { ...book.identifiers, isbn },
        publisher,
        pubdate: pubDate ? new Date(pubDate).toISOString() : book.pubdate,
        languages: [language === "Indonesian" ? "ind" : "eng"],
        comments: description ? `<p>${description}</p>` : ""
      });
    }
  }, [title, author, series, seriesIndex, rating, tags, isbn, publisher, pubDate, language, description]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      
      {/* Basic Information */}
      <Card className="p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Book Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" 
            />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Author</label>
            <Input 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)}
              className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Series</label>
              <Input 
                value={series} 
                onChange={(e) => setSeries(e.target.value)}
                placeholder="None"
                className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" 
              />
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Number</label>
              <Input 
                value={seriesIndex} 
                onChange={(e) => setSeriesIndex(e.target.value)}
                className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium text-center" 
              />
            </div>
          </div>
          <div className="flex items-end pb-2">
            <div className="flex items-center gap-1.5 w-full">
              {[...Array(5)].map((_, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <Star className={`w-6 h-6 transition-colors ${i < rating ? "text-[#d4b28c] fill-[#d4b28c]" : "text-zinc-300 dark:text-zinc-700"}`} />
                </button>
              ))}
              <span className="ml-2 text-sm text-[#94a3b8] dark:text-zinc-500 font-medium">{rating}.0 / 5.0</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Keywords & Categories */}
      <Card className="p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center p-1.5">
            <Leaf className="w-full h-full" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Keywords & Categories</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-3 block">Tags [Press Enter to Add]</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 bg-[#e2e8f0] dark:bg-zinc-800 px-3 py-1 rounded-full text-xs font-semibold text-[#1e293b] dark:text-zinc-200">
                  <span>{tag}</span>
                  <button 
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 transition-colors text-zinc-500 dark:text-zinc-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <Input 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press enter..." 
              className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm font-medium" 
            />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Reading Status</label>
            <div className="relative">
              <select className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 px-3 appearance-none font-medium outline-none focus:border-zinc-400">
                <option>Finished</option>
                <option>Reading</option>
                <option>To Read</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Details */}
      <Card className="p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center p-1.5">
            <Target className="w-full h-full" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Additional Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">ISBN -13</label>
            <Input 
              value={isbn} 
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 9781234567890"
              className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" 
            />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Publisher</label>
            <Input 
              value={publisher} 
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="e.g. Penguin Books"
              className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" 
            />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Published Date</label>
            <Input 
              type="date"
              value={pubDate} 
              onChange={(e) => setPubDate(e.target.value)}
              className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" 
            />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Language</label>
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 px-3 appearance-none font-medium outline-none focus:border-zinc-400"
              >
                <option>English</option>
                <option>Indonesian</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Synopsis & Notes */}
      <Card className="p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center p-1.5">
            <VenetianMask className="w-full h-full" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Synopsis & Notes</h3>
        </div>
        <div>
          <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-3 block">Book Description</label>
          <textarea 
            className="w-full min-h-[160px] rounded-lg border border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 p-4 outline-none focus:border-zinc-400 font-medium text-sm leading-relaxed resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a synopsis for this book..."
          />
        </div>
      </Card>

    </div>
  );
}
