"use client";

import { useBookPreview } from "@/components/providers/book-preview-context";
import { Star } from "lucide-react";

export default function BookPreviewSidebar() {
  const { hoveredBook } = useBookPreview();

  return (
    <div
      className={`fixed right-0 top-[79px] bottom-0 w-[230px] lg:w-[280px] h-[calc(100vh-79px)] z-40 shadow-2xl bg-[#182330] border-l border-t border-white/10 rounded-tl-2xl text-white flex flex-col items-center justify-start transition-all duration-300 ease-in-out select-none pointer-events-none ${
        hoveredBook 
          ? "translate-x-0 opacity-100 visible" 
          : "translate-x-full opacity-0 invisible"
      }`}
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(20, 28, 38, 0.95) 0%, rgba(24, 35, 48, 0.75) 50%, rgba(70, 130, 180, 0.95) 100%), url('/assets/images/sidebar/Bg-Sidebar.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {hoveredBook && (
        <div className="w-full h-full flex flex-col items-center text-center p-4 lg:p-6 justify-start pt-8 lg:pt-10 gap-4 lg:gap-5 animate-in fade-in slide-in-from-right-8 duration-300 ease-out">
          
          {/* Cover image */}
          <div className="w-40 h-56 bg-blue-900/40 rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative flex items-center justify-center border border-white/10 flex-shrink-0 transition-transform duration-500 hover:scale-105">
            {hoveredBook.coverUrl ? (
              <img
                src={hoveredBook.coverUrl}
                alt={hoveredBook.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <span className="text-2xl font-serif font-bold text-white/20 mb-2">
                  {hoveredBook.title.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 3)}
                </span>
                <span className="text-xs font-bold text-white/40 tracking-wider bg-white/10 px-2 py-0.5 rounded uppercase">
                  {hoveredBook.format}
                </span>
              </div>
            )}
          </div>

          {/* Stars Rating */}
          <div className="flex justify-center gap-1 mt-0.5">
            {[...Array(5)].map((_, i) => {
              const isFilled = i < (hoveredBook.rating || 0);
              return (
                <Star
                  key={i}
                  className={`w-4 h-4 lg:w-4.5 lg:h-4.5 transition-colors ${
                    isFilled
                      ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]"
                      : "text-amber-500/40"
                  }`}
                  strokeWidth={1.5}
                />
              );
            })}
          </div>

          {/* Details Section */}
          <div className="flex flex-col items-center gap-1 w-full">
            <h3 className="font-bold text-sm lg:text-base font-serif text-white leading-tight tracking-wide px-2 uppercase max-h-[44px] lg:max-h-[50px] overflow-hidden text-ellipsis">
              {hoveredBook.title}
            </h3>
            <p className="text-[10px] lg:text-[11px] text-zinc-400 font-medium tracking-wide">
              {hoveredBook.author}
            </p>
            
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[8px] lg:text-[9px] font-bold text-zinc-300 bg-white/10 px-1.5 py-0.5 rounded tracking-widest uppercase">
                {hoveredBook.format}
              </span>
              {hoveredBook.totalPages && (
                <>
                  <span className="w-1 h-1 bg-zinc-600 rounded-full" />
                  <span className="text-[10px] lg:text-[11px] text-zinc-400">
                    {hoveredBook.totalPages.toLocaleString()} Pages
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Synopsis Paragraph */}
          {hoveredBook.description && (
            <div className="w-full mt-1 px-1 text-center">
              <p className="text-[10px] lg:text-[13px] text-zinc-200 leading-relaxed font-normal text-center tracking-wide px-1 lg:px-3">
                {hoveredBook.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
