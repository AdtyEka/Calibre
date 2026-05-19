"use client";

import { useState, useRef, useEffect } from "react";
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
  Search,
  RefreshCw,
  Cloud
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

export default function EditBookContents() {
  const [tabs, setTabs] = useState<DocTab[]>([
    {
      id: "ch1",
      title: "Chapter 1",
      level: 1,
      content: `<h1>Chapter 1 : The Whisper Gazette</h1>
<p>Evangeline shoved the two-week-old newsprint into the pocket of her flowered skirt. The door at the end of this decrepit alley was barely taller than she was, and hidden behind a rusted metal grate instead of covered in beautiful bloodred paint, but she would have bet her father's curiosity shop that this was the missing door.</p>
<p>Nothing in the Temple District was this unattractive. Every entry here was carved panels, decorative architraves, glass awnings, and gilded keyholes. Her father had been a man of faith, but he used to say that the churches here were like vampires—they weren't meant for worship, they were designed to entice and entrap. But this door was different. This door was just a rough block of wood with a missing handle and chipped white paint.</p>
<p>This door did not want to be found. Yet it couldn't hide what it truly was from Evangeline. The jagged shape of it was unmistakable. One side was a sloping curve, the other a serrated slash, forming one half of a broken heart—a symbol of the Fated Prince of Hearts. Finally.</p>
<p>If hope were a pair of wings, Evangeline's were stretching out behind her, eager to take flight again. After two weeks of searching the city of Valenda, she'd found it.</p>
<p>When the gossip sheet in her pocket had first announced that the door from the Prince of Hearts' church had gone missing, few imagined it was magic. It was the scandal sheet's first article, and people said it was part of a hoax to sell subscriptions. Doors didn't simply disappear.</p>`,
      pages: 12,
      startPage: 15
    },
    {
      id: "ch1-intro",
      title: "Introduction",
      level: 2,
      content: `<h2>Introduction</h2>
<p>This scholarly edition compiles the complete history of the Whisper Gazette, documenting the magical happenings in the Temple District. As Evangeline learned, some stories are more than simple gossip—they carry the weight of ancient bargains and forgotten kingdoms.</p>
<p>We present here the verified accounts of the Prince of Hearts and the mysterious doors that bridge the mortal realm with the Fated territories.</p>`,
      pages: 4,
      startPage: 16
    },
    {
      id: "ch1-map",
      title: "Map of The Circus",
      level: 2,
      content: `<h2>Map of The Circus</h2>
<p>The layout of the Caraval circus grounds is designed in concentric, ever-shifting rings. Visitors are cautioned that paths do not always lead to the same destination twice, and distance is a matter of perception rather than physical measurement.</p>
<p>Key landmarks include:</p>
<ul>
  <li>The Whisper Gazebo - Center point of information and secrets</li>
  <li>The Clockwork Spire - Controlling the subjective passage of day and night</li>
  <li>The Hall of Broken Mirrors - Where dreams and warnings collide</li>
</ul>`,
      pages: 3,
      startPage: 20
    },
    {
      id: "ch2",
      title: "Chapter 2",
      level: 1,
      content: `<h1>Chapter 2 : The Bargain</h1>
<p>The next day, Evangeline returned to the alleyway, her fingers tracing the rough contours of the half-heart wooden block. The air smelled of sugar and old parchment, a sure sign that magic was lingering nearby. She knew the risks of bargaining with a Fate, but the alternative was a life of quiet regret.</p>
<p>"I know you're listening," she whispered to the keyhole.</p>
<p>A soft click echoed in the silence, and the block of wood began to glow with a pale, golden light.</p>`,
      pages: 15,
      startPage: 23
    },
    {
      id: "ch3",
      title: "Chapter 3",
      level: 1,
      content: `<h1>Chapter 3 : The Clockwork Spire</h1>
<p>Time inside Valenda did not behave. In the shadow of the Clockwork Spire, seconds stretched into hours, while whole afternoons vanished in the blink of an eye. Evangeline watched the golden hands spin backward, feeling the slow pulse of the city's heartbeat matching her own.</p>`,
      pages: 18,
      startPage: 38
    },
    {
      id: "ch4",
      title: "Chapter 4",
      level: 1,
      content: `<h1>Chapter 4 : Valenda's Secret</h1>
<p>Rumors in the marketplace spoke of a library that existed only between midnight and dawn. A library where the books read you, instead of the other way around. Evangeline knew she would have to find it if she wanted to break the spell.</p>`,
      pages: 14,
      startPage: 56
    },
    {
      id: "ch5",
      title: "Chapter 5",
      level: 1,
      content: `<h1>Chapter 5 : The Prince of Hearts</h1>
<p>He was exactly as the stories described—beautiful, cold, and entirely lethal. The Prince of Hearts sat upon his throne of white roses, a half-eaten apple in one hand, looking at Evangeline with eyes that had seen empires rise and fall.</p>
<p>"You are late," he said.</p>`,
      pages: 20,
      startPage: 70
    }
  ]);

  const [activeTabId, setActiveTabId] = useState("ch1");
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({
    "ch1": true
  });
  const [zoom, setZoom] = useState("100%");
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [fontSize, setFontSize] = useState(14);
  const [headingType, setHeadingType] = useState("Heading 2");
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState("");
  const [newTabParent, setNewTabParent] = useState("none");

  const editorRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Initialize editor content when active tab changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = activeTab.content;
    }
  }, [activeTabId]);

  const handleEditorChange = () => {
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML;
      setTabs(prev => prev.map(t => t.id === activeTab.id ? { ...t, content: updatedContent } : t));
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

    const newTab: DocTab = {
      id: newId,
      title: newTabTitle,
      level: newTabParent === "none" ? 1 : 2,
      content: `<h1>${newTabTitle}</h1><p>Start writing your content here...</p>`,
      pages: 5,
      startPage: tabs[tabs.length - 1].startPage + tabs[tabs.length - 1].pages
    };

    if (newTabParent === "none" || parentIndex === -1) {
      setTabs(prev => [...prev, newTab]);
    } else {
      // Insert right after parent or parent's last child
      const updated = [...tabs];
      updated.splice(parentIndex + 1, 0, newTab);
      setTabs(updated);
      setExpandedTabs(prev => ({ ...prev, [newTabParent]: true }));
    }

    setActiveTabId(newId);
    setNewTabTitle("");
    setShowAddTabModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-zinc-950">
      
      {/* Sticky formatting toolbar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm px-8 py-3 flex flex-wrap items-center gap-2">
        {/* History Actions */}
        <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1 gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("undo")} title="Undo">
            <Undo className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("redo")} title="Redo">
            <Redo className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Print">
            <Printer className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
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

        {/* Heading Dropdown */}
        <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1">
          <div className="relative">
            <select 
              value={headingType} 
              onChange={(e) => {
                setHeadingType(e.target.value);
                const tag = e.target.value === "Heading 1" ? "h1" : e.target.value === "Heading 2" ? "h2" : "p";
                handleFormat("formatBlock", tag);
              }}
              className="appearance-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold px-3.5 py-1.5 pr-7 border-none outline-none text-zinc-700 dark:text-zinc-300 cursor-pointer w-28"
            >
              <option>Heading 1</option>
              <option>Heading 2</option>
              <option>Paragraph</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Font Family Dropdown */}
        <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1">
          <div className="relative">
            <select 
              value={fontFamily} 
              onChange={(e) => {
                setFontFamily(e.target.value);
                handleFormat("fontName", e.target.value);
              }}
              className="appearance-none bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-semibold px-3.5 py-1.5 pr-7 border-none outline-none text-zinc-700 dark:text-zinc-300 cursor-pointer w-36"
            >
              <option value="Times New Roman">Times New Roman</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {/* Font Size Selector */}
        <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1 gap-1">
          <Button variant="ghost" size="icon" className="w-6 h-6 rounded-lg text-xs font-bold" onClick={() => setFontSize(prev => Math.max(8, prev - 1))}>-</Button>
          <span className="text-xs font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300 w-7 text-center">{fontSize}</span>
          <Button variant="ghost" size="icon" className="w-6 h-6 rounded-lg text-xs font-bold" onClick={() => setFontSize(prev => Math.min(72, prev + 1))}>+</Button>
        </div>

        {/* Character Formatting Actions */}
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
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Text Color" onClick={() => handleFormat("foreColor", "#D12B47")}>
            <Baseline className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Highlight Text" onClick={() => handleFormat("hiliteColor", "#fef08a")}>
            <Highlighter className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
        </div>

        {/* Structural Actions */}
        <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1 gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("createLink", prompt("Enter URL:") || "")} title="Insert Link">
            <LinkIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Insert Comment">
            <MessageSquare className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" title="Insert Image" onClick={() => handleFormat("insertImage", prompt("Enter Image URL:") || "")}>
            <ImageIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
        </div>

        {/* Alignment Actions */}
        <div className="flex items-center border-r border-zinc-200 dark:border-zinc-800 pr-3 mr-1 gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("justifyLeft")} title="Align Left">
            <AlignLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("justifyCenter")} title="Align Center">
            <AlignCenter className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("justifyRight")} title="Align Right">
            <AlignRight className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("justifyFull")} title="Justify">
            <AlignJustify className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
        </div>

        {/* Lists & Indents */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("insertUnorderedList")} title="Unordered List">
            <List className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("insertOrderedList")} title="Ordered List">
            <ListOrdered className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("indent")} title="Indent">
            <Indent className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("outdent")} title="Outdent">
            <Outdent className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => handleFormat("removeFormat")} title="Clear Formatting">
            <Eraser className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
          </Button>
        </div>
      </div>

      {/* Main Work Area */}
      <div className="flex-1 flex p-8 gap-8 overflow-hidden">
        {/* Left Panel: Document Tabs Tree View */}
        <Card className="w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col p-6 shadow-none flex-shrink-0 h-fit">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="font-bold text-[#64748b] dark:text-zinc-400 text-sm tracking-wide">Document Tabs</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 p-0"
              onClick={() => setShowAddTabModal(true)}
            >
              <Plus className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </Button>
          </div>

          {/* Chapters Tree navigation */}
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] pr-1">
            {tabs.map((tab) => {
              const hasChildren = tabs.some(t => t.level === 2 && tab.id === "ch1" && t.id.startsWith("ch1-"));
              const isChild = tab.level === 2;
              const isExpanded = expandedTabs[tab.id];

              // If it's a child and its parent is not expanded, don't render it
              if (isChild && !expandedTabs["ch1"]) return null;

              return (
                <div 
                  key={tab.id}
                  style={{ paddingLeft: `${(tab.level - 1) * 16}px` }}
                  className="flex flex-col"
                >
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleExpand(tab.id);
                      }
                      setActiveTabId(tab.id);
                    }}
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg text-left text-sm font-semibold transition-all relative ${
                      activeTabId === tab.id
                        ? "bg-[#e0f2fe] text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {/* Expand/Collapse Chevron */}
                    {hasChildren ? (
                      isExpanded ? (
                        <ChevronDownIcon className="w-3.5 h-3.5 text-zinc-400" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                      )
                    ) : (
                      isChild && <div className="w-3.5 h-[1px] bg-zinc-200 dark:bg-zinc-800 ml-1.5 mr-0.5" />
                    )}

                    <span>{tab.title}</span>
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
              className="flex-1 outline-none text-[#1e293b] dark:text-zinc-100 leading-relaxed font-serif prose dark:prose-invert max-w-none min-h-[50vh]"
            >
              {/* Loaded dynamically by useEffect */}
            </div>

            {/* Pagination Footer */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center text-sm font-bold text-zinc-400 dark:text-zinc-500 font-sans tracking-wide">
              Page {activeTab.startPage} of 275
            </div>
          </Card>
        </div>
      </div>

      {/* Add Tab Modal */}
      {showAddTabModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="bg-white dark:bg-zinc-950 w-full max-w-md p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border border-zinc-200 dark:border-zinc-850">
            <h3 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100">Add New Document Tab</h3>
            
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Tab Title</label>
                <Input 
                  value={newTabTitle}
                  onChange={(e) => setNewTabTitle(e.target.value)}
                  placeholder="e.g. Chapter 6 or Scene 1" 
                  className="h-11 rounded-lg border-zinc-200 dark:border-zinc-800 bg-transparent font-medium"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-semibold mb-1 block">Parent Chapter</label>
                <div className="relative">
                  <select 
                    value={newTabParent} 
                    onChange={(e) => setNewTabParent(e.target.value)}
                    className="w-full h-11 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-950 px-3 appearance-none font-medium outline-none"
                  >
                    <option value="none">None (Root Chapter)</option>
                    {tabs.filter(t => t.level === 1).map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button 
                variant="outline" 
                className="h-11 rounded-lg font-semibold border-zinc-200 dark:border-zinc-800"
                onClick={() => setShowAddTabModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="h-11 rounded-lg font-semibold bg-[#1e293b] hover:bg-black text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-black px-5"
                onClick={addNewTab}
              >
                Add Tab
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
