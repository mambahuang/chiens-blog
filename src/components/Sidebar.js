import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Layers, User, ChevronRight, ChevronDown,
  Github, Linkedin, Mail
} from 'lucide-react';

export default function Sidebar({
  setActiveTab, clearFilters, isCatOpen, setIsCatOpen,
  setFilterCat, setReadingPost, setCurrentPage, setIsSidebarOpen
}) {
  return (
    <div className="flex flex-col h-full justify-between overflow-y-auto no-scrollbar">
      <div>
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-36 h-36 rounded-full border-4 border-kinpaku p-1 mb-4 shadow-xl overflow-hidden bg-lacquer-deep">
            <img src="/images/cover_resized.jpg" alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold text-champagne mb-2 tracking-tight uppercase">Chien's Blog </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-ink-accent px-2">
            自分の人生は自分で決める
          </p>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => { setActiveTab('home'); clearFilters(); setIsSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-champagne border border-transparent hover:border-kinpaku transition-colors duration-200"
          >
            <Home size={18} /> Home
          </button>

          <div className="py-2">
            <button onClick={() => setIsCatOpen(!isCatOpen)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-black text-text-muted uppercase tracking-widest hover:text-ink-accent">
              <div className="flex items-center gap-3"><Layers size={14} /> Category</div>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isCatOpen ? '' : '-rotate-90'}`} />
            </button>
            <AnimatePresence initial={false}>
              {isCatOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-8 mt-1 space-y-1">
                  {["Courses", "AI", "IC Design", "Japanese"].map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setFilterCat(cat); setReadingPost(null); setActiveTab('home'); setCurrentPage(1); setIsSidebarOpen(false); }}
                      className="w-full text-left text-xs py-2 flex items-center gap-2 transition-colors text-text-muted hover:text-ink-accent"
                    >
                      <ChevronRight size={12} /> {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => { setActiveTab('about'); setReadingPost(null); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-champagne border border-transparent hover:border-kinpaku transition-colors duration-200">
            <User size={18} /> About
          </button>
        </nav>
      </div>

      <div className="pt-8 border-t border-rule flex items-center mt-4">
        <div className="flex gap-4">
          <a href="https://github.com/mambahuang" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-ink-accent transition-colors"><Github size={20}/></a>
          <a href="https://www.linkedin.com/in/chien-huang-56688b2b1/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-ink-accent transition-colors"><Linkedin size={20}/></a>
          <a href="mailto:mambahuang0824@gmail.com" className="text-text-muted hover:text-ink-accent transition-colors"><Mail size={20}/></a>
        </div>
      </div>
    </div>
  );
}