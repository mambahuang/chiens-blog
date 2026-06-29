import { Calendar } from 'lucide-react';

export default function PostCard({ post, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="p-8 bg-white dark:bg-[#0d1520] rounded-[2rem] border dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer group"
    >
      <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors mb-4">
        {post.title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed text-sm">
        {post.excerpt}
      </p>
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-2">
          <Calendar size={12}/> {post.date}
        </span>
        <div className="flex gap-2">
          {post.tags.map(t => (
            <span key={t} className="text-blue-500">#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}