import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, setCurrentPage, scrollToTop }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-4">
      <button
        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToTop(); }}
        disabled={currentPage === 1}
        className="p-3 rounded-md border border-rule disabled:opacity-20 hover:bg-kinpaku hover:text-lacquer-deep hover:border-kinpaku transition-all shadow-sm"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentPage(i + 1); scrollToTop(); }}
            className={`w-12 h-12 rounded-md border font-bold transition-all ${currentPage === i + 1 ? 'bg-kinpaku border-kinpaku text-lacquer-deep shadow-lg' : 'bg-lacquer-raised border-rule hover:border-kinpaku'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }}
        disabled={currentPage === totalPages}
        className="p-3 rounded-md border border-rule disabled:opacity-20 hover:bg-kinpaku hover:text-lacquer-deep hover:border-kinpaku transition-all shadow-sm"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}