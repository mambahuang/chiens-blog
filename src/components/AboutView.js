import { motion } from 'framer-motion';
import { 
  FileText, Code, Languages as LangIcon, GraduationCap, 
  Cpu, Terminal, Award, BookOpen, User, CheckCircle2 
} from 'lucide-react';

export default function AboutView({ 
  technicalSkills, 
  languageData, 
  educationData, 
  softSkills, 
  keyCourses 
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-16 pb-20">
      
      {/* --- 1. Bio Section --- */}
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic underline decoration-blue-500 decoration-8 underline-offset-12 mb-10">
          About Me
        </h2>
        <section className="p-8 md:p-10 bg-white dark:bg-[#0d1520] rounded-[2.5rem] border dark:border-slate-800 shadow-sm leading-loose text-lg text-slate-600 dark:text-slate-300 relative overflow-hidden">
          <div className="relative z-10">
            I am <span className="text-blue-500 font-bold">Chien Huang (黃芊)</span>, a Graduate Research Assistant at NCKU Digital IC Design Lab. 
            I specialize in the convergence of hardware architecture, security, and AI optimization.
            <div className="mt-8 flex flex-wrap gap-4">
               <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                 <FileText size={18} /> Download CV
               </button>
               <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
                  <CheckCircle2 size={14} className="text-blue-500"/> Open for Collaboration
               </div>
            </div>
          </div>
          {/* 裝飾性背景圖標 */}
          <Cpu size={120} className="absolute -right-8 -bottom-8 opacity-[0.03] dark:opacity-[0.05] -rotate-12" />
        </section>
      </header>

      {/* --- 2. Skills Matrix (Technical + Soft) --- */}
      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em] mb-6 flex items-center gap-3">
            <Code size={18}/> Technical Stack
          </h3>
          <div className="space-y-4">
            {technicalSkills.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-[#0d1520] rounded-2xl border dark:border-slate-800 shadow-sm hover:translate-x-2 transition-transform">
                <div className="text-blue-500">{s.icon}</div>
                <span className="text-sm font-bold dark:text-slate-200">{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em] mb-6 flex items-center gap-3">
            <Award size={18}/> Soft Skills
          </h3>
          <div className="space-y-4">
            {softSkills.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-[#0d1520]/50 rounded-2xl border border-dashed dark:border-slate-800">
                <div className="text-blue-500">{s.icon}</div>
                <span className="text-sm font-bold dark:text-slate-300">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- 3. Professional Info (Languages + Courses) --- */}
      <div className="grid md:grid-cols-2 gap-10">
        <section>
          <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em] mb-6 flex items-center gap-3">
            <LangIcon size={18}/> Languages
          </h3>
          <div className="space-y-4">
            {languageData.map((l, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-[#0d1520] rounded-2xl border dark:border-slate-800 shadow-sm">
                <span className="font-bold flex items-center gap-2 text-sm">
                  <span className="text-xl">{l.icon}</span> {l.name}
                </span>
                <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-full uppercase">
                  {l.cert}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em] mb-6 flex items-center gap-3">
            <BookOpen size={18}/> Key Courses
          </h3>
          <div className="flex flex-wrap gap-2">
            {keyCourses.map((course, i) => (
              <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold rounded-lg border dark:border-slate-700">
                {course}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* --- 4. Education --- */}
      <section>
        <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em] mb-8 flex items-center gap-3">
          <GraduationCap size={18}/> Education
        </h3>
        <div className="space-y-6">
          {educationData.map((edu, i) => (
            <div key={i} className="p-8 bg-white dark:bg-[#0d1520] rounded-3xl border-l-8 border-blue-500 shadow-sm relative group">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                <h4 className="text-xl font-black uppercase dark:text-white">{edu.title}</h4>
                <span className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full w-fit">
                  {edu.date}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-tighter">
                {edu.school}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">
                {edu.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}