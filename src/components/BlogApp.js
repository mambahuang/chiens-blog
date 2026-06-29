"use client";

import Sidebar from './Sidebar';
import PostCard from './PostCard';
import AboutView from './AboutView';
import Pagination from './Pagination';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Layers, Tag, Calendar, ChevronUp, ChevronDown, X, Menu,
  Terminal, Code, Cpu, Smartphone, ArrowLeft, Home, ChevronRight
} from 'lucide-react';

// --- 常數設定 ---
const POSTS_PER_PAGE = 5;

const technicalSkills = [
  { name: "Verilog / SystemVerilog", icon: <Cpu size={18} /> },
  { name: "Python (AI/ML/Data)", icon: <Terminal size={18} /> },
  { name: "C / C++ (Firmware)", icon: <Code size={18} /> },
  { name: "Embedded System (STM32)", icon: <Smartphone size={18} /> }
];

// --- 1. Education ---
const educationData = [
  {
    school: "National Cheng Kung University (NCKU)",
    date: "2025.09 ~ 2027.06 (Pursuing)",
    title: "Master of CS & Information Engineering",
    desc: "From Digital IC Design Lab. Focus on hardware architectures."
  },
  {
    school: "National Cheng Kung University (NCKU)",
    date: "2021.09 ~ 2025.06",
    title: "Bachelor of CS & Information Engineering",
    desc: "Focus on hardware security and circuit design."
  }
];

const languageData = [
  { name: "English", cert: "TOEIC 825", icon: "🇬🇧" },
  { name: "Japanese", cert: "JLPT N4", icon: "🇯🇵" }
];

export default function BlogApp({ posts = [] }) {
  const [activeTab, setActiveTab] = useState('home');
  const [readingPost, setReadingPost] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [filterCat, setFilterCat] = useState(null);
  const [isCatOpen, setIsCatOpen] = useState(false); // 預設為收合
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showScroll, setShowScroll] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 300 && !showScroll) setShowScroll(true);
      if (window.scrollY <= 300 && showScroll) setShowScroll(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScroll]);

  // 從文章自動推導所有標籤，並依出現次數由高到低排序
  const allTags = useMemo(() => {
    const counts = new Map();
    posts.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [posts]);

  // Tag Cloud 預設只顯示熱門前幾個，其餘收合
  const TAG_CLOUD_LIMIT = 10;
  const visibleTags = showAllTags ? allTags : allTags.slice(0, TAG_CLOUD_LIMIT);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchTag = filterTag ? (p.tags || []).includes(filterTag) : true;
      const matchCat = filterCat ? p.category === filterCat : true;
      return matchTag && matchCat;
    });
  }, [posts, filterTag, filterCat]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  if (!mounted) return null;

  const clearFilters = () => {
    setFilterTag(null);
    setFilterCat(null);
    setCurrentPage(1);
    setReadingPost(null);
    setActiveTab('home');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#050a10] text-slate-900 dark:text-slate-100 transition-colors duration-500">

        {/* --- 手機版頂部 --- */}
        <header className="md:hidden sticky top-0 z-[60] bg-white/80 dark:bg-[#0d1520]/80 backdrop-blur-md border-b dark:border-slate-800 px-6 h-16 flex items-center justify-between">
          <h1 className="font-black tracking-tighter uppercase text-blue-500">Charmander</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-white"><Menu size={24} /></button>
        </header>

        {/* --- 手機側邊欄 --- */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-[70] md:hidden" />
              <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-[#0d1520] z-[80] p-8 md:hidden shadow-2xl">
                <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400"><X size={24}/></button>
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} clearFilters={clearFilters} isCatOpen={isCatOpen} setIsCatOpen={setIsCatOpen} setFilterCat={setFilterCat} filterCat={filterCat} setReadingPost={setReadingPost} setCurrentPage={setCurrentPage} setIsSidebarOpen={setIsSidebarOpen} theme={theme} setTheme={setTheme} readingPost={readingPost} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* --- 佈局架構：閱讀文章時收起左右側欄，內容區佔滿全寬 --- */}
        <div className={`max-w-screen-2xl mx-auto flex flex-col gap-0 md:gap-4 min-h-screen relative ${readingPost ? 'md:block' : 'md:grid md:grid-cols-[280px_1fr_300px]'}`}>

          {/* 1. Sidebar (貼左固定，閱讀文章時隱藏) */}
          <aside className={`md:flex bg-white dark:bg-[#0d1520] border-r dark:border-slate-800 p-8 flex-col h-screen sticky top-0 z-50 ${readingPost ? 'hidden md:hidden' : 'hidden md:flex'}`}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} clearFilters={clearFilters} isCatOpen={isCatOpen} setIsCatOpen={setIsCatOpen} setFilterCat={setFilterCat} filterCat={filterCat} setReadingPost={setReadingPost} setCurrentPage={setCurrentPage} setIsSidebarOpen={setIsSidebarOpen} theme={theme} setTheme={setTheme} readingPost={readingPost} />
          </aside>

          {/* 2. Main Content (中間拉寬) */}
          <main className="p-6 md:p-12 min-h-screen">
            <AnimatePresence mode="wait">
              {readingPost ? (
                <motion.article key="reading" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
                  {/* 麵包屑路徑 */}
                  <nav className="flex items-center flex-wrap gap-1.5 text-xs font-bold text-slate-400 mb-8" aria-label="Breadcrumb">
                    <button onClick={clearFilters} className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <Home size={13} /> Home
                    </button>
                    {readingPost.category && (
                      <>
                        <ChevronRight size={13} className="text-slate-300 dark:text-slate-600" />
                        <button onClick={() => { setFilterCat(readingPost.category); setFilterTag(null); setReadingPost(null); setActiveTab('home'); setCurrentPage(1); scrollToTop(); }} className="hover:text-blue-500 transition-colors">
                          {readingPost.category}
                        </button>
                      </>
                    )}
                    <ChevronRight size={13} className="text-slate-300 dark:text-slate-600" />
                    <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px] md:max-w-none">{readingPost.title}</span>
                  </nav>

                  <button onClick={() => setReadingPost(null)} className="flex items-center gap-2 text-sm font-bold text-blue-500 mb-8 hover:-translate-x-2 transition-transform">
                    <ArrowLeft size={16}/> Back to List
                  </button>
                  <header className="mb-12">
                    <h2 className="text-4xl font-black mb-4 leading-tight">{readingPost.title}</h2>
                    <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-2"><Calendar size={14}/> {readingPost.date}</span>
                       <span className="flex items-center gap-2 text-blue-500"><Layers size={14}/> {readingPost.category}</span>
                    </div>
                  </header>
                  <div className="prose dark:prose-invert max-w-none prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:overflow-x-auto prose-code:break-words break-words leading-relaxed">
                    <ReactMarkdown>{readingPost.content}</ReactMarkdown>
                  </div>
                </motion.article>
              ) : (
                <div className="w-full">
                  {activeTab === 'home' && (
                    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="md:hidden pb-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><Tag size={12} /> Filter by tag</h4>
                        <div className="flex flex-wrap items-center gap-2">
                        {visibleTags.map(tag => (
                          <button key={tag} onClick={() => { setFilterTag(tag === filterTag ? null : tag); setCurrentPage(1); }} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-black border transition-all ${filterTag === tag ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-[#0d1520] border-slate-200 dark:border-slate-800 text-slate-500'}`}>{tag}</button>
                        ))}
                        {allTags.length > TAG_CLOUD_LIMIT && (
                          <button onClick={() => setShowAllTags(!showAllTags)} className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-black text-blue-500 hover:text-blue-600 transition-colors">
                            {showAllTags ? <>Less <ChevronUp size={14} /></> : <>+{allTags.length - TAG_CLOUD_LIMIT} <ChevronDown size={14} /></>}
                          </button>
                        )}
                        </div>
                      </div>

                      <header className="mb-10 flex justify-between items-end border-b dark:border-slate-800 pb-6">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                            {filterTag ? `Tag: ${filterTag}` : filterCat ? filterCat : "Latest Articles"}
                          </h2>
                          <div className="h-1 w-12 bg-blue-500 mt-2 rounded-full"></div>
                        </div>
                        {(filterTag || filterCat) && (
                          <button onClick={clearFilters} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"><X size={14}/> Clear Filter</button>
                        )}
                      </header>

                      <div className="space-y-8">
                        {currentPosts.length > 0 ? (
                          currentPosts.map(post => <PostCard key={post.id} post={post} onClick={() => { setReadingPost(post); scrollToTop(); }} />)
                        ) : (
                          <p className="text-slate-400 text-sm">目前還沒有文章。在 content/posts/ 新增 .md 檔即可。</p>
                        )}
                      </div>
                      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} scrollToTop={scrollToTop} />
                    </motion.div>
                  )}

                  {activeTab === 'about' && (
                    <AboutView
                      technicalSkills={technicalSkills}
                      languageData={languageData}
                      educationData={educationData}
                    />
                  )}
                </div>
              )}
            </AnimatePresence>
          </main>

          {/* 3. 右側掛件 (Widget，閱讀文章時隱藏) */}
          <aside className={`p-8 border-l dark:border-slate-800 sticky top-0 h-screen overflow-y-auto no-scrollbar ${readingPost ? 'hidden' : 'hidden md:block'}`}>
            <div className="mb-12">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2"><Tag size={14} /> Filter by tag</h4>
              <div className="flex flex-wrap gap-2">
                {visibleTags.map(tag => (
                  <button key={tag} onClick={() => {setFilterTag(tag === filterTag ? null : tag); setFilterCat(null); setActiveTab('home'); setCurrentPage(1); setReadingPost(null); scrollToTop();}} className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${filterTag === tag ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-[#0d1520] border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-500 uppercase'}`}>#{tag}</button>
                ))}
              </div>
              {allTags.length > TAG_CLOUD_LIMIT && (
                <button onClick={() => setShowAllTags(!showAllTags)} className="mt-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors">
                  {showAllTags ? <>Show less <ChevronUp size={12} /></> : <>Show all ({allTags.length}) <ChevronDown size={12} /></>}
                </button>
              )}
            </div>

            <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-xl shadow-blue-500/20 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Status</h4>
               <p className="text-sm font-bold leading-relaxed">Currently exploring VLSI Design & Secure Cryptoprocessor.</p>
            </div>
          </aside>

        </div>
      </div>

      {/* --- 全域回到頂端按鈕 --- */}
      <AnimatePresence>
        {showScroll && (
          <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={scrollToTop} className="fixed bottom-10 right-10 p-4 bg-blue-600 text-white rounded-full shadow-2xl z-[100] hover:bg-blue-700 transition-all ring-4 ring-white dark:ring-[#050a10]">
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
