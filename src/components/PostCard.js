import { Calendar } from 'lucide-react';

export default function PostCard({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-8 bg-lacquer-raised rounded-md border border-rule hover:border-kinpaku hover:shadow-2xl transition-all cursor-pointer group"
    >
      <h3 className="font-sans text-2xl font-bold tracking-tight mb-4">
        {post.title}
      </h3>
      <p className="text-text-muted mb-6 line-clamp-2 leading-relaxed text-sm">
        {post.excerpt}
      </p>
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted">
        <span className="flex items-center gap-2">
          <Calendar size={12}/> {post.date}
        </span>
        <div className="flex gap-2">
          {post.tags.map(t => (
            <span key={t} className="text-ink-accent">#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}