import { motion } from 'framer-motion';

// src/components/ArchivesView.js
export default function ArchivesView({ experienceData }) {
  return (
    <div className="space-y-12">
      <header className="text-center mb-16"><h2 className="text-3xl font-black uppercase tracking-tighter italic">Project & Career Timeline</h2></header>
      <div className="relative border-l-2 border-blue-500/20 ml-6 space-y-12">
        {experienceData.map((exp, idx) => (
          <div key={idx} className="relative pl-12 group">
            {/* 圓點動畫 */}
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${exp.title.includes('IEEE') ? 'bg-orange-500 ring-orange-500' : 'bg-blue-500 ring-white dark:ring-[#050a10]'} ring-4 transition-transform group-hover:scale-150 shadow-blue-500/50`} />
            
            <div className={`${exp.title.includes('IEEE') ? 'text-orange-500' : 'text-blue-500'} font-black text-[10px] tracking-widest mb-1`}>{exp.date}</div>
            
            <div className={`p-6 rounded-2xl border ${exp.title.includes('IEEE') ? 'bg-orange-50/10 border-orange-500/30' : 'bg-white dark:bg-[#0d1520] border-slate-200 dark:border-slate-800'} shadow-sm`}>
              <h4 className="text-lg font-bold uppercase dark:text-white leading-tight">{exp.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed font-medium">{exp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}