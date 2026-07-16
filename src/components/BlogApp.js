"use client";

import Sidebar from "./Sidebar";
import PostCard from "./PostCard";
import AboutView from "./AboutView";
import Pagination from "./Pagination";
import TagFilter from "./TagFilter";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  InfoBox,
  InfoBoxTitle,
  InfoBoxContent,
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDate,
  TimelineContent,
} from "./ProseBlocks";
import {
  Layers,
  Calendar,
  ChevronUp,
  X,
  Menu,
  ArrowLeft,
  Home,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

// --- 常數設定 ---
const POSTS_PER_PAGE = 5;

// Maps the class names posts use in markdown to their rendering component.
const PROSE_BLOCKS = {
  'info-box': InfoBox,
  'info-box-title': InfoBoxTitle,
  'info-box-content': InfoBoxContent,
  'custom-timeline': Timeline,
  'custom-timeline-item': TimelineItem,
  'timeline-title': TimelineTitle,
  'timeline-date': TimelineDate,
  'timeline-content': TimelineContent,
};

export default function BlogApp({ posts = [] }) {
  const [activeTab, setActiveTab] = useState("home");
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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showScroll]);

  // 從文章自動推導所有標籤，並依出現次數由高到低排序
  const allTags = useMemo(() => {
    const counts = new Map();
    posts.forEach((p) =>
      (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)),
    );
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchTag = filterTag ? (p.tags || []).includes(filterTag) : true;
      const matchCat = filterCat ? p.category === filterCat : true;
      return matchTag && matchCat;
    });
  }, [posts, filterTag, filterCat]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  if (!mounted) return null;

  const clearFilters = () => {
    setFilterTag(null);
    setFilterCat(null);
    setCurrentPage(1);
    setReadingPost(null);
    setActiveTab("home");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Selecting a tag replaces any active category filter and returns to the list.
  const selectTag = (tag) => {
    setFilterTag(tag);
    setFilterCat(null);
    setActiveTab("home");
    setCurrentPage(1);
    setReadingPost(null);
    scrollToTop();
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-lacquer text-champagne transition-colors duration-500">
        {/* --- 頂部列 (所有尺寸)：Charmander + 三條線 --- */}
        <header className="sticky top-0 z-[60] bg-lacquer-raised/80 backdrop-blur-md border-b border-rule px-6 h-16 flex items-center justify-between">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 font-display text-xl font-bold tracking-tight uppercase text-ink-accent hover:opacity-80 transition-opacity"
          >
            Charmander
            <img
              src="/images/dino.png"
              alt=""
              aria-hidden="true"
              className="h-7 w-auto shrink-0"
            />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="p-2 text-champagne hover:text-ink-accent transition-colors"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="p-2 text-champagne hover:text-ink-accent transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* --- 側邊抽屜 (所有尺寸，預設收起) --- */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-[70]"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-lacquer-raised border-r border-rule z-[80] p-8 shadow-2xl"
              >
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close menu"
                  className="absolute top-4 right-4 p-2 text-text-muted hover:text-ink-accent transition-colors"
                >
                  <X size={24} />
                </button>
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  clearFilters={clearFilters}
                  isCatOpen={isCatOpen}
                  setIsCatOpen={setIsCatOpen}
                  setFilterCat={setFilterCat}
                  filterCat={filterCat}
                  setReadingPost={setReadingPost}
                  setCurrentPage={setCurrentPage}
                  setIsSidebarOpen={setIsSidebarOpen}
                  readingPost={readingPost}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* --- 佈局架構：sidebar 改為抽屜；內容區 + 右側 tag 欄 --- */}
        <div
          className={`max-w-screen-2xl mx-auto flex flex-col gap-0 md:gap-4 min-h-screen relative ${readingPost ? "md:block" : "md:grid md:grid-cols-[1fr_300px]"}`}
        >
          {/* Main Content (中間拉寬) */}
          <main className="p-6 md:p-12 min-h-screen">
            <AnimatePresence mode="wait">
              {readingPost ? (
                <motion.article
                  key="reading"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* 麵包屑路徑 */}
                  <nav
                    className="flex items-center flex-wrap gap-1.5 text-xs font-bold text-text-muted mb-8"
                    aria-label="Breadcrumb"
                  >
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 hover:text-ink-accent transition-colors"
                    >
                      <Home size={13} /> Home
                    </button>
                    {readingPost.category && (
                      <>
                        <ChevronRight size={13} className="text-text-faint" />
                        <button
                          onClick={() => {
                            setFilterCat(readingPost.category);
                            setFilterTag(null);
                            setReadingPost(null);
                            setActiveTab("home");
                            setCurrentPage(1);
                            scrollToTop();
                          }}
                          className="hover:text-ink-accent transition-colors"
                        >
                          {readingPost.category}
                        </button>
                      </>
                    )}
                    <ChevronRight size={13} className="text-text-faint" />
                    <span className="text-champagne truncate max-w-[200px] md:max-w-none">
                      {readingPost.title}
                    </span>
                  </nav>

                  <button
                    onClick={() => setReadingPost(null)}
                    className="flex items-center gap-2 text-sm font-bold text-ink-accent mb-8 hover:-translate-x-2 transition-transform"
                  >
                    <ArrowLeft size={16} /> Back to List
                  </button>
                  <header className="mb-12">
                    <h2 className="font-sans text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight text-balance">
                      {readingPost.title}
                    </h2>
                    <div className="flex items-center gap-6 text-xs text-text-muted font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} /> {readingPost.date}
                      </span>
                      <span className="flex items-center gap-2 text-ink-accent">
                        <Layers size={14} /> {readingPost.category}
                      </span>
                    </div>
                  </header>
                  <div className="prose dark:prose-invert max-w-none marker:text-ink-accent prose-pre:bg-lacquer-deep prose-pre:text-champagne prose-pre:overflow-x-auto prose-pre:rounded-md prose-code:break-words break-words leading-relaxed prose-a:text-patina-deep dark:prose-a:text-patina prose-headings:tracking-tight prose-h1:mt-14 prose-h1:mb-4 prose-h2:mt-12 prose-h2:mb-3 prose-h3:mt-8 prose-h3:mb-2">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // Posts style rich blocks by class name; ProseBlocks
                        // owns the look so content stays theme-aware.
                        div: ({ node, className, ...props }) => {
                          const Block = PROSE_BLOCKS[className];
                          if (Block) return <Block {...props} />;
                          return <div className={className} {...props} />;
                        },
                        // Inline <style> in content would leak page-wide.
                        style: () => null,
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-6 rounded-md border border-rule">
                            <table
                              className="w-full text-sm border-collapse my-0"
                              {...props}
                            />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead className="bg-champagne/5" {...props} />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            className="text-left font-bold px-4 py-2 border-b border-rule whitespace-nowrap"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td
                            className="px-4 py-2 border-b border-rule align-top"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {readingPost.content}
                    </ReactMarkdown>
                  </div>
                </motion.article>
              ) : (
                <div className="w-full">
                  {activeTab === "home" && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="md:hidden pb-6">
                        <TagFilter
                          allTags={allTags}
                          filterTag={filterTag}
                          onSelectTag={selectTag}
                          showAllTags={showAllTags}
                          setShowAllTags={setShowAllTags}
                        />
                      </div>

                      <header className="mb-10 flex justify-between items-end border-b border-rule pb-6">
                        <div>
                          <h2 className="font-sans text-3xl md:text-4xl font-bold tracking-tight">
                            {filterTag
                              ? `Tag: ${filterTag}`
                              : filterCat
                                ? filterCat
                                : "Latest Articles"}
                          </h2>
                          <div className="h-1 w-12 bg-kinpaku mt-2 rounded-full"></div>
                        </div>
                        {(filterTag || filterCat) && (
                          <button
                            onClick={clearFilters}
                            className="text-xs font-bold text-ink-accent hover:underline flex items-center gap-1"
                          >
                            <X size={14} /> Clear Filter
                          </button>
                        )}
                      </header>

                      <div className="space-y-8">
                        {currentPosts.length > 0 ? (
                          currentPosts.map((post) => (
                            <PostCard
                              key={post.id}
                              post={post}
                              onClick={() => {
                                setReadingPost(post);
                                scrollToTop();
                              }}
                            />
                          ))
                        ) : (
                          <p className="text-text-muted text-sm">
                            目前還沒有文章。在 content/posts/ 新增 .md 檔即可。
                          </p>
                        )}
                      </div>
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        scrollToTop={scrollToTop}
                      />
                    </motion.div>
                  )}

                  {activeTab === "about" && <AboutView />}
                </div>
              )}
            </AnimatePresence>
          </main>

          {/* 右側 tag 欄 (閱讀文章時隱藏) */}
          <aside
            className={`p-8 border-l border-rule sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar ${readingPost ? "hidden" : "hidden md:block"}`}
          >
            <TagFilter
              allTags={allTags}
              filterTag={filterTag}
              onSelectTag={selectTag}
              showAllTags={showAllTags}
              setShowAllTags={setShowAllTags}
            />
          </aside>
        </div>
      </div>

      {/* --- 全域回到頂端按鈕 --- */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-10 right-10 p-4 bg-kinpaku text-lacquer-deep rounded-md shadow-2xl z-[100] hover:bg-kinpaku-deep transition-colors"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
