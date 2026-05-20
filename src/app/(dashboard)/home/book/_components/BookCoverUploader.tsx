import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function BookCoverUploader() {
  return (
    <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit">
      <span className="text-sm font-semibold text-[#64748b] dark:text-zinc-400 mb-4 block">Book Cover</span>
      <div className="w-full aspect-[3/4] bg-[#dbeafe] dark:bg-blue-900/30 rounded-xl mb-4"></div>
      <Button variant="outline" className="border-zinc-300 dark:border-zinc-700 h-16 rounded-xl flex flex-col items-center justify-center gap-1 mb-6 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[#1e293b] dark:text-zinc-300">
        <Plus className="w-5 h-5" />
        <span className="text-xs font-semibold">Add Custom Book Cover</span>
      </Button>
      <button className="text-[#D12B47] text-sm font-bold tracking-wide hover:opacity-70 transition-opacity w-full text-center">REMOVE COVER</button>
    </div>
  );
}
