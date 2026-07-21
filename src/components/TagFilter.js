import { Tag, ChevronUp, ChevronDown } from 'lucide-react';

// Tag cloud shows the most-used tags first; the rest collapse behind a toggle.
const TAG_CLOUD_LIMIT = 8;

export default function TagFilter({
  allTags,
  filterTag,
  onSelectTag,
  showAllTags,
  setShowAllTags,
}) {
  const visibleTags = showAllTags ? allTags : allTags.slice(0, TAG_CLOUD_LIMIT);
  const hiddenCount = allTags.length - TAG_CLOUD_LIMIT;

  return (
    <div>
      <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 md:mb-8 flex items-center gap-2">
        <Tag size={12} /> Filter by tag
      </h4>
      <div className="flex flex-wrap gap-2">
        {visibleTags.map((tag) => {
          const isSelected = filterTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onSelectTag(isSelected ? null : tag)}
              aria-pressed={isSelected}
              className={`px-4 py-2 rounded-md text-[10px] font-black uppercase border transition-all ${
                isSelected
                  ? "bg-kinpaku border-kinpaku text-gold-ink shadow-lg shadow-kinpaku/25"
                  : "bg-lacquer-raised border-rule hover:border-kinpaku text-text-muted"
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
      {hiddenCount > 0 && (
        <button
          onClick={() => setShowAllTags(!showAllTags)}
          className="mt-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-ink-accent hover:text-champagne transition-colors"
        >
          {showAllTags ? (
            <>
              Show less <ChevronUp size={12} />
            </>
          ) : (
            <>
              Show all ({allTags.length}) <ChevronDown size={12} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
