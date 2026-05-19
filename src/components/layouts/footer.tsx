export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-[60px] bg-sidebar border-t border-sidebar-border text-sidebar-foreground/70 text-sm font-medium px-8 flex items-center justify-between">
      <div className="uppercase tracking-wider">
        CALIBRE v7.4.2 — SCHOLARLY EDITION
      </div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-sidebar-foreground transition-colors">Documentation</a>
        <a href="#" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-sidebar-foreground transition-colors">Support</a>
      </div>
    </footer>
  )
}   