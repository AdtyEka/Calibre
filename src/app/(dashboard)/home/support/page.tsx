"use client";

import { useState } from "react";
import { MessageSquare, BookOpen, HelpCircle, ArrowRight, Plus, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Support() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  const faqs = [
    {
      question: "How Do I import books from a legacy library ?",
      answer: "To import your legacy files, select \"Add Books\" from the sidebar and choose \"Add from folders and subfolders\". Calibre will automatically scan for metadata and covers during the process.",
      link: "Read more about batch importing"
    },
    {
      question: "Converting PDF to EPUB",
      answer: "PDF conversion can be tricky due to fixed layouts. We recommend using the \"Heuristic Analysis\" option in the Conversion dialog to help Calibre identify"
    },
    {
      question: "Syncing your digital library",
      answer: "You can sync your library across devices by connecting to the Calibre content server or using cloud storage solutions like Dropbox or Google Drive."
    }
  ];

  return (
    <>
      <div className="flex-1 p-8 flex flex-col gap-8 relative w-full">
            
            <div className="bg-[#eff6ff] dark:bg-blue-900/10 rounded-2xl p-12 flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#1e293b] dark:text-zinc-100 mb-4">Help Center</h1>
              <p className="text-[#64748b] dark:text-zinc-400 max-w-xl mb-8 text-sm md:text-base">
                Find answers, explore our documentation, or join the community discussion. How can we assist your digital library today?
              </p>
              
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <Input 
                  type="text" 
                  placeholder="Search help articles" 
                  className="w-full pl-11 pr-32 py-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 rounded-full text-base focus:outline-none focus:ring-1 focus:ring-zinc-400 h-auto shadow-sm"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-zinc-800 text-white rounded-full px-6 py-2 h-auto">
                  Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-none flex gap-4 bg-white dark:bg-zinc-950">
                <div className="w-12 h-12 rounded-lg bg-[#dbeafe] dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-[#1e293b] dark:text-zinc-300" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold font-serif mb-2 text-[#1e293b] dark:text-zinc-100">Community Forum</h3>
                  <p className="text-sm text-[#64748b] dark:text-zinc-400 mb-4 leading-relaxed">
                    Engage with fellow bibliophiles and experts. Share workflows and get crowdsourced solutions.
                  </p>
                  <a href="#" className="text-sm font-semibold flex items-center gap-2 mt-auto text-[#1e293b] dark:text-zinc-300 hover:opacity-70 transition-opacity">
                    Join Conversation <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </Card>

              <Card className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-none flex gap-4 bg-white dark:bg-zinc-950">
                <div className="w-12 h-12 rounded-lg bg-[#dbeafe] dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-[#1e293b] dark:text-zinc-300" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold font-serif mb-2 text-[#1e293b] dark:text-zinc-100">User Documentation</h3>
                  <p className="text-sm text-[#64748b] dark:text-zinc-400 mb-4 leading-relaxed">
                    The definitive guide to every feature. Detailed tutorials from basic cataloging to metadata scripting.
                  </p>
                  <a href="#" className="text-sm font-semibold flex items-center gap-2 mt-auto text-[#1e293b] dark:text-zinc-300 hover:opacity-70 transition-opacity">
                    Explore Guides <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </Card>
            </div>

            {/* FAQ Section */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-[#1e293b] dark:text-zinc-100" />
                <h2 className="text-2xl font-bold font-serif text-[#1e293b] dark:text-zinc-100">Frequently Asked Questions</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-48 flex-shrink-0 flex flex-col gap-1">
                  <Button className="justify-start bg-[#dbeafe] dark:bg-blue-900/30 text-[#1e293b] dark:text-zinc-100 hover:bg-blue-200 dark:hover:bg-blue-900/50 shadow-none h-auto py-2.5">
                    Importing
                  </Button>
                  <Button variant="ghost" className="justify-start text-[#64748b] dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 h-auto py-2.5 font-normal">
                    Conversion
                  </Button>
                  <Button variant="ghost" className="justify-start text-[#64748b] dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 h-auto py-2.5 font-normal">
                    Syncing
                  </Button>
                  <Button variant="ghost" className="justify-start text-[#64748b] dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 h-auto py-2.5 font-normal">
                    Mobile
                  </Button>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div key={index} className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-200">
                        <button 
                          onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                          className="w-full px-6 py-4 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border-b border-transparent data-[state=open]:border-zinc-200 dark:data-[state=open]:border-zinc-800"
                          data-state={isOpen ? 'open' : 'closed'}
                        >
                          <span className="font-bold font-serif text-[#1e293b] dark:text-zinc-100 text-left">{faq.question}</span>
                          <ChevronDown className={`w-5 h-5 text-[#64748b] dark:text-zinc-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <div 
                          className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-zinc-200 dark:border-zinc-800' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-6">
                              <p className="text-sm text-[#64748b] dark:text-zinc-400 leading-relaxed mb-4">
                                {faq.answer}
                              </p>
                              {faq.link && (
                                <a href="#" className="text-sm font-semibold text-[#1e293b] dark:text-zinc-300 underline underline-offset-4 hover:opacity-70 transition-opacity">
                                  {faq.link}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button className="fixed bottom-20 right-8 bg-[#E5C39C] hover:bg-[#D4B28B] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors z-50 p-0">
              <Plus className="w-6 h-6" />
            </Button>
          </div>
    </>
  );
}