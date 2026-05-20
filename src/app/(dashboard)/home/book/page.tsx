"use client";

import { useState } from "react";
import { Download, Share, Edit, FileEdit, Repeat, FolderOpen, Trash2, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookCoverUploader from "./_components/BookCoverUploader";
import BookMetadataForm from "./_components/BookMetadataForm";
import ConnectModal from "@/components/ConnectModal";
import RemoveModal from "./_components/RemoveModal";

export default function BookDetail() {
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

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
                    <button onClick={() => setIsMetadataModalOpen(true)} className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold cursor-pointer">
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
                    <button 
                      onClick={() => setIsFolderModalOpen(true)}
                      className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold cursor-pointer"
                    >
                      <FolderOpen className="w-5 h-5" />
                      <span>Show in Folder</span>
                    </button>
                    <button 
                      onClick={() => setIsRemoveModalOpen(true)}
                      className="flex items-center gap-3 text-[#1e293b] dark:text-zinc-200 hover:opacity-70 transition-opacity text-left font-semibold cursor-pointer"
                    >
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
              <BookCoverUploader />

              {/* Right Column - Forms */}
              <BookMetadataForm />
            </div>
          </div>
        </div>
      )}

      {/* Connect to Folder Modal */}
      <ConnectModal 
        isOpen={isFolderModalOpen} 
        onClose={() => setIsFolderModalOpen(false)} 
      />

      {/* Remove Confirmation Modal */}
      <RemoveModal 
        isOpen={isRemoveModalOpen} 
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={() => {
          alert("Book removed successfully from calibre library!");
          setIsRemoveModalOpen(false);
        }}
      />
    </>
  );
}



