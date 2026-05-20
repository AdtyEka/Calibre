interface FormatSelectorProps {
  defaultOutput: string;
  setDefaultOutput: (value: string) => void;
  qualityProfile: string;
  setQualityProfile: (value: string) => void;
}

export default function FormatSelector({
  defaultOutput,
  setDefaultOutput,
  qualityProfile,
  setQualityProfile,
}: FormatSelectorProps) {
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-zinc-950 rounded-xl p-5 border border-zinc-100 dark:border-zinc-800/80 mt-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800 pb-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Global Preferences</span>
        <button className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">Advanced</button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-[#94a3b8] dark:text-zinc-500 font-bold mb-1.5 block">Default Output</label>
          <select 
            value={defaultOutput}
            onChange={(e) => setDefaultOutput(e.target.value)}
            className="w-full h-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-xs font-semibold px-3 appearance-none outline-none cursor-pointer"
          >
            <option>EPUB (Modern)</option>
            <option>MOBI (Legacy)</option>
            <option>PDF (Standard)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-[#94a3b8] dark:text-zinc-500 font-bold mb-1.5 block">Quality Profile</label>
          <select 
            value={qualityProfile}
            onChange={(e) => setQualityProfile(e.target.value)}
            className="w-full h-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-xs font-semibold px-3 appearance-none outline-none cursor-pointer"
          >
            <option>High (300 DPI)</option>
            <option>Standard (150 DPI)</option>
            <option>Low (72 DPI)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
