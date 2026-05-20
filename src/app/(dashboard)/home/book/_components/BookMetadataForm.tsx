import { Info, Leaf, Target, VenetianMask, Star, X, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function BookMetadataForm() {
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
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Book Title</label>
            <Input defaultValue="Six of Crows" className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Author</label>
            <Input defaultValue="Leigh Bardugo" className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Series</label>
              <Input defaultValue="Six of Crows" className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" />
            </div>
            <div>
              <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Number</label>
              <Input defaultValue="1" className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium text-center" />
            </div>
          </div>
          <div className="flex items-end pb-2">
            <div className="flex items-center gap-1.5 w-full">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < 4 ? "text-[#d4b28c] fill-[#d4b28c]" : "text-zinc-300 dark:text-zinc-700"}`} />
              ))}
              <span className="ml-2 text-sm text-[#94a3b8] dark:text-zinc-500 font-medium">4.0 / 5.0</span>
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
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-3 block">Tags [Comma Separated]</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {['Fiction', 'Fantasy', 'Mystery'].map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 bg-[#e2e8f0] dark:bg-zinc-800 px-3 py-1.5 rounded-full text-sm font-medium text-[#1e293b] dark:text-zinc-200">
                  <button className="hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  {tag}
                </div>
              ))}
            </div>
            <Input placeholder="Add more tags..." className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950" />
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
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">ISBN -13</label>
            <Input defaultValue="9781780622293" className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Publisher</label>
            <Input defaultValue="Hachette UK" className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Published Date</label>
            <Input defaultValue="29/09/2015" className="h-11 rounded-lg border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 font-medium" />
          </div>
          <div>
            <label className="text-sm text-[#94a3b8] dark:text-zinc-500 font-medium mb-1.5 block">Language</label>
            <div className="relative">
              <select className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-700 text-[#1e293b] dark:text-zinc-200 bg-white dark:bg-zinc-950 px-3 appearance-none font-medium outline-none focus:border-zinc-400">
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
            defaultValue={`Meet Kaz Brekker and his crew: Jesper, Inej, Wylan, and the star-crossed Nina and Matthias, on the heist of a lifetime in Six of Crows from #1 bestselling author, Leigh Bardugo.

Ketterdam: a bustling hub of international trade where anything can be had for the right priceand no one knows that better than criminal prodigy Kaz Brekker. Kaz is offered a chance at a deadly heist that could make him rich beyond his wildest dreams. But he can't pull it off alone. . .

A convict with a thirst for revenge.`}
          />
        </div>
      </Card>

    </div>
  );
}
