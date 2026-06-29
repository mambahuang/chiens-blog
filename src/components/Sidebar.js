import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { 
  Home, Layers, User, ChevronRight, ChevronDown,
  Github, Linkedin, Mail, Sun, Moon 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, setActiveTab, clearFilters, isCatOpen, setIsCatOpen, 
  setFilterCat, setReadingPost, setCurrentPage, setIsSidebarOpen,
  theme, setTheme, lang 
}) {
  return (
    <div className="flex flex-col h-full justify-between overflow-y-auto no-scrollbar">
      <div>
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-36 h-36 rounded-full border-4 border-blue-500 p-1 mb-4 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img src="/images/profile.jpg" alt="Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">Chien's Blog </h1>
          <div className="text-[12px] font-bold text-blue-500 h-5 px-2">
            <Typewriter 
              words={["自分の人生は自分で決める", "A site to record my life."]} 
              loop={0} cursor cursorStyle='_' typeSpeed={70} deleteSpeed={50} delaySpeed={2000} 
            />
          </div>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={() => { setActiveTab('home'); clearFilters(); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'home' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Home size={18} /> Home
          </button>
          
          <div className="py-2">
            <button onClick={() => setIsCatOpen(!isCatOpen)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-500">
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
                      className="w-full text-left text-xs py-2 flex items-center gap-2 transition-colors text-slate-500 hover:text-blue-500"
                    >
                      <ChevronRight size={12} /> {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => { setActiveTab('about'); setReadingPost(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'about' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <User size={18} /> About
          </button>
        </nav>
      </div>

      <div className="pt-8 border-t dark:border-slate-800 flex items-center justify-between mt-4">
        <div className="flex gap-4">
          <a href="https://github.com/mambahuang" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><Github size={20}/></a>
          <a href="https://www.linkedin.com/in/chien-huang-56688b2b1/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><Linkedin size={20}/></a>
          <a href="mailto:mambahuang0824@gmail.com" className="text-slate-400 hover:text-blue-500 transition-colors"><Mail size={20}/></a>
        </div>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-500">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
}