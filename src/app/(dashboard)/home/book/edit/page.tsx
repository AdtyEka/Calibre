"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Undo, 
  Redo, 
  Printer, 
  ZoomIn, 
  ChevronDown, 
  Bold, 
  Italic, 
  Underline, 
  Baseline, 
  Highlighter, 
  Link as LinkIcon, 
  MessageSquare, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignRight, 
  AlignCenter, 
  AlignJustify,
  List, 
  ListOrdered, 
  Indent, 
  Outdent, 
  Eraser, 
  Plus, 
  ChevronRight,
  ChevronDown as ChevronDownIcon,
  Loader2,
  Save,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DocTab {
  id: string;
  title: string;
  level: number;
  content: string;
  pages: number;
  startPage: number;
}

function EditBookContentsInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = searchParams.get("id");

  const [tabs, setTabs] = useState<DocTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({});
  
  const [zoom, setZoom] = useState("100%");
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [fontSize, setFontSize] = useState(14);
  const [headingType, setHeadingType] = useState("Heading 2");
  
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState("");
  const [newTabParent, setNewTabParent] = useState("none");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);

  // 1. Fetch exploded EPUB
  useEffect(() => {
    if (!bookId) {
      setErrorMsg("Missing Book ID in URL");
      setIsLoading(false);
      return;
    }

    const loadBook = async () => {
      try {
        const res = await fetch(`/api/epub/explode?id=${bookId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal membongkar buku");
        
        if (data.tabs && data.tabs.length > 0) {
          setTabs(data.tabs);
          setActiveTabId(data.tabs[0].id);
        }
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBook();
  }, [bookId]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const prevTabIdRef = useRef<string>("");

  // Initialize editor content ONLY when switching tabs, not on every content change
  useEffect(() => {
    if (editorRef.current && activeTab && activeTabId !== prevTabIdRef.current) {
      editorRef.current.innerHTML = activeTab.content;
      prevTabIdRef.current = activeTabId;
    }
  }, [activeTabId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEditorChange = () => {
    if (editorRef.current && activeTab) {
      const updatedContent = editorRef.current.innerHTML;
      setTabs(prev => prev.map(t => t.id === activeTab.id ? { ...t, content: updatedContent } : t));
    }
  };

  // Helper function to save a specific tab's content to the Docker container
  const saveTabContent = async (tabId: string, content: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/epub/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          filePath: tabId,
          newContent: content
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan file");
      return true;
    } catch (err: any) {
      console.error("Error saving tab:", err);
      return false;
    }
  };

  const handleEditorBlur = async () => {
    if (!editorRef.current || !activeTab || !bookId) return;
    
    const currentContent = editorRef.current.innerHTML;
    setIsSaving(true);
    const success = await saveTabContent(activeTab.id, currentContent);
    if (!success) {
      alert("Error saving: Gagal menyimpan perubahan");
    }
    setIsSaving(false);
  };

  const handleRebuild = async () => {
    if (!bookId) return;
    setIsRebuilding(true);
    
    try {
      // 1. Save the current editor content first (in case user didn't click away)
      if (editorRef.current && activeTab) {
        const currentContent = editorRef.current.innerHTML;
        // Update local state
        setTabs(prev => prev.map(t => t.id === activeTab.id ? { ...t, content: currentContent } : t));
        // Save to Docker
        const saved = await saveTabContent(activeTab.id, currentContent);
        if (!saved) {
          const proceed = confirm("Gagal menyimpan tab aktif. Lanjutkan rebuild?");
          if (!proceed) {
            setIsRebuilding(false);
            return;
          }
        }
      }

      // 2. Implode the EPUB
      const res = await fetch("/api/epub/implode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyusun ulang buku");
      
      alert("Buku berhasil disusun ulang! Perubahan sudah tersimpan ke library.");
      router.push(`/home/book?id=${bookId}`);
    } catch (err: any) {
      alert("Error rebuilding: " + err.message);
      setIsRebuilding(false);
    }
  };

  const handleFormat = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      handleEditorChange();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTabs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addNewTab = () => {
    if (!newTabTitle.trim()) return;

    const newId = `tab-${Date.now()}`;
    const parentIndex = tabs.findIndex(t => t.id === newTabParent);
    const startPage = tabs.length > 0 ? tabs[tabs.length - 1].startPage + tabs[tabs.length - 1].pages : 1;

    const newTab: DocTab = {
      id: newId,
      title: newTabTitle,
      level: newTabParent === "none" ? 1 : 2,
      content: `<h1>${newTabTitle}</h1><p>Start writing your content here...</p>`,
      pages: 1,
      startPage
    };

    if (newTabParent === "none" || parentIndex === -1) {
      setTabs(prev => [...prev, newTab]);
    } else {
      const updated = [...tabs];
      updated.splice(parentIndex + 1, 0, newTab);
      setTabs(updated);
      setExpandedTabs(prev => ({ ...prev, [newTabParent]: true }));
    }

    setActiveTabId(newId);
    setNewTabTitle("");
    setShowAddTabModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] dark:bg-zinc-950 flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        <p className="text-zinc-500 font-medium">Membongkar EPUB... (Mungkin memakan waktu)</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] dark:bg-zinc-950 flex-col gap-4">
        <p className="text-red-500 font-bold">{errorMsg}</p>
        <Button onClick={() => router.back()} variant="outline">Kembali</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-zinc-950">
      
      {/* Sticky formatting toolbar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm px-8 py-3 flex flex-wrap items-center gap-2 justify-between">
        
        <div className="flex flex-wrap items-center gap-2">
          {/* History Actions */}
          <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1 gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("undo")} title="Undo">
              <Undo className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("redo")} title="Redo">
              <Redo className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </Button>
          </div>

          {/* Zoom Level */}
          <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1 gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
              <ZoomIn className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </Button>
            <div className="relative">
              <select 
                value={zoom} 
                onChange={(e) => setZoom(e.target.value)}
                className="appearance-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold px-3.5 py-1.5 pr-7 border-none outline-none text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                <option>100%</option>
                <option>125%</option>
                <option>150%</option>
                <option>75%</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            </div>
          </div>

          {/* Font Actions */}
          <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1 gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("bold")} title="Bold">
              <Bold className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("italic")} title="Italic">
              <Italic className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("underline")} title="Underline">
              <Underline className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </Button>
          </div>
        </div>

        {/* Action Buttons Right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-xs font-semibold text-zinc-400 mr-2">
            {isSaving ? (
              <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Menyimpan...</>
            ) : (
              <><Save className="w-3 h-3 mr-1" /> Tersimpan</>
            )}
          </div>
          <Button 
            onClick={handleRebuild}
            disabled={isRebuilding}
            className="bg-[#1e293b] hover:bg-black dark:bg-zinc-100 dark:hover:bg-white dark:text-black shadow-none font-semibold text-sm rounded-lg"
          >
            {isRebuilding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Package className="w-4 h-4 mr-2" />}
            Rebuild Book
          </Button>
        </div>

      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex p-8 gap-8 overflow-hidden">
        {/* Left Panel: Document Tabs Tree View */}
        <Card className="w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col p-6 shadow-none flex-shrink-0 h-fit">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="font-bold text-[#64748b] dark:text-zinc-400 text-sm tracking-wide">Document Files</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 p-0"
              onClick={() => setShowAddTabModal(true)}
              title="Fitur tambah tab belum tersedia untuk API"
            >
              <Plus className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </Button>
          </div>

          {/* Chapters Tree navigation */}
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] pr-1">
            {tabs.map((tab) => {
              const isChild = false;
              const hasChildren = false;
              return (
                <div key={tab.id} className="flex flex-col">
                  <button
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg text-left text-sm font-semibold transition-all relative truncate ${
                      activeTabId === tab.id
                        ? "bg-[#e0f2fe] text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <span className="truncate" title={tab.title}>{tab.title}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Panel: Editor Paper Sheet Container */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto pr-2 max-h-[75vh]">
          <Card 
            className="w-full max-w-4xl min-h-[70vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-md rounded-2xl p-12 relative flex flex-col"
            style={{ 
              fontFamily: fontFamily, 
              fontSize: `${fontSize}px` 
            }}
          >
            {/* Scrollable Document Area */}
            <div 
              ref={editorRef}
              contentEditable
              onInput={handleEditorChange}
              onBlur={handleEditorBlur}
              className="flex-1 outline-none text-[#1e293b] dark:text-zinc-100 leading-relaxed font-serif prose dark:prose-invert max-w-none min-h-[50vh]"
            >
              {/* Loaded dynamically by useEffect */}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center text-sm font-bold text-zinc-400 dark:text-zinc-500 font-sans tracking-wide">
              {activeTab?.title}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EditBookContents() {
  return (
    <Suspense fallback={<div className="p-8">Memuat editor...</div>}>
      <EditBookContentsInner />
    </Suspense>
  );
}
