import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, setCurrentPage, scrollToTop }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-4">
      <button 
        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToTop(); }} 
        disabled={currentPage === 1} 
        className="p-3 rounded-xl border dark:border-slate-800 disabled:opacity-20 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button 
            key={i} 
            onClick={() => { setCurrentPage(i + 1); scrollToTop(); }} 
            className={`w-12 h-12 rounded-xl border dark:border-slate-800 font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white dark:bg-[#0d1520] hover:border-blue-500'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button 
        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }} 
        disabled={currentPage === totalPages} 
        className="p-3 rounded-xl border dark:border-slate-800 disabled:opacity-20 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}