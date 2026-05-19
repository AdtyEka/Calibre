"use client";

import { useState } from "react";
import { Download, Share, Edit, FileEdit, Repeat, FolderOpen, Trash2, ChevronRight, Plus, Info, Leaf, Target, VenetianMask, Star, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function BookDetail() {
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

  return (
    <>
      <div className="flex-1 p-8 flex flex-col relative max-w-7xl w-full">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-[#64748b] dark:text-zinc-400 font-medium mb-8">
              <Link href="/home/library" className="hover:text-[#1e293b] dark:hover:text-zinc-200 transition-colors">Library</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="#" className="hover:text-[#1e293b] dark:hover:text-zinc-200 transition-colors">Science Fiction</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#94a3b8] dark:text-zinc-500">Hail Mary</span>
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              {/* Left Column */}
              <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-6">
                {/* Book Cover Placeholder */}
                <div className="w-full aspect-[3/4] bg-[#dbeafe] dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  {/* Empty cover as per screenshot */}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11 rounded-full border-zinc-200 dark:border-zinc-700 text-[#64748b] dark:text-zinc-300 font-medium shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    Download
                  </Button>
                  <Button variant="outline" className="h-11 rounded-full border-zinc-200 dark:border-zinc-700 text-[#64748b] dark:text-zinc-300 font-medium shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    Share
                  </Button>
                </div>

                {/* Management Card */}
                <div className="bg-[#e2e8f0] dark:bg-zinc-900 rounded-2xl p-6">
                  <h3 className="text-[#64748b] dark:text-zinc-400 font-bold mb-5">Management</h3>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setIsMetadataModalOpen(true)} className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold">
                      <Edit className="w-5 h-5" />
                      <span>Edit Metadata</span>
                    </button>
                    <Link href="/home/book/edit" className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold">
                      <FileEdit className="w-5 h-5" />
                      <span>Edit Book Contents</span>
                    </Link>
                    <Link href="/home/convert" className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold">
                      <Repeat className="w-5 h-5" />
                      <span>Convert Format</span>
                    </Link>
                    <button className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold">
                      <FolderOpen className="w-5 h-5" />
                      <span>Show in Folder</span>
                    </button>
                    <button className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold">
                      <Trash2 className="w-5 h-5" />
                      <span>Remove from Library</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#1e293b] dark:text-zinc-100 mb-3">Hail Mary</h1>
                    <div className="flex items-center text-[#64748b] dark:text-zinc-400 font-medium">
                      <span>Andy Weir</span>
                      <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700 mx-3" />
                      <span>EPUB</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-[260px] flex-shrink-0 flex flex-col">
                    <Button className="h-auto w-full bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white text-base font-semibold py-3 rounded-lg transition-colors mb-4 shadow-sm">
                      Resume Reading
                    </Button>
                    <div className="flex justify-between text-sm text-[#64748b] dark:text-zinc-400 font-medium mb-2">
                      <span>12% Complete</span>
                      <span>Page 59 of 496</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#E5C39C] rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Synopsis */}
                <div>
                  <h3 className="text-[#64748b] dark:text-zinc-400 font-bold mb-4 text-lg">Synopsis</h3>
                  <div className="flex flex-col gap-5 text-[#64748b] dark:text-zinc-400 leading-relaxed">
                    <p>
                      A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.
                    </p>
                    <p>
                      Ryland Grace is the sole survivor on a desperate, last-chance mission--and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.
                    </p>
                    <p>
                      All he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company.
                    </p>
                    <p>
                      His crewmates dead, his memories fuzzily returning, he realizes that an impossible task now confronts him. Alone on this tiny ship that's been cobbled together by every government and space agency on the planet and hurled into the depths of space, it's up to him to conquer an extinction-level threat to our species.
                    </p>
                    <p>
                      And thanks to an unexpected ally, he just might have a chance.
                    </p>
                    <p>
                      Part scientific mystery, part dazzling interstellar journey, Project Hail Mary is a tale of discovery, speculation, and survival to rival The Martian--while taking us to places it never dreamed of going
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="fixed bottom-20 right-8 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors z-50 p-0">
              <Plus className="w-6 h-6" />
            </Button>
          </div>

      {/* Edit Metadata Modal */}
      {isMetadataModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
          <div className="bg-[#f8fafc] dark:bg-zinc-950 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
              <h2 className="text-3xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Edit Metadata</h2>
              <div className="flex items-center gap-6">
                <button onClick={() => setIsMetadataModalOpen(false)} className="text-[#1e293b] dark:text-zinc-300 font-semibold hover:opacity-70 transition-opacity">Cancel</button>
                <Button onClick={() => setIsMetadataModalOpen(false)} className="bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-black text-white px-6 rounded-lg font-medium shadow-none">Save Changes</Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 flex flex-col md:flex-row gap-8">
              {/* Left Column - Cover */}
              <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 h-fit">
                <span className="text-sm font-semibold text-[#64748b] dark:text-zinc-400 mb-4 block">Book Cover</span>
                <div className="w-full aspect-[3/4] bg-[#dbeafe] dark:bg-blue-900/30 rounded-xl mb-4"></div>
                <Button variant="outline" className="border-zinc-300 dark:border-zinc-700 h-16 rounded-xl flex flex-col items-center justify-center gap-1 mb-6 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[#1e293b] dark:text-zinc-300">
                  <Plus className="w-5 h-5" />
                  <span className="text-xs font-semibold">Add Custom Book Cover</span>
                </Button>
                <button className="text-[#D12B47] text-sm font-bold tracking-wide hover:opacity-70 transition-opacity w-full text-center">REMOVE COVER</button>
              </div>

              {/* Right Column - Forms */}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
