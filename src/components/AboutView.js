import { motion } from 'framer-motion';
import {
  Code, GraduationCap, Cpu, CheckCircle2, Award, ExternalLink
} from 'lucide-react';

export default function AboutView({
  technicalSkills,
  languageData,
  educationData
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-16 pb-20">
      
      {/* --- 1. Bio Section --- */}
      <header>
        <h2 className="text-4xl font-black uppercase tracking-tighter italic underline decoration-blue-500 decoration-8 underline-offset-12 mb-10">
          About Me
        </h2>
        <section className="p-8 md:p-10 bg-white dark:bg-[#0d1520] rounded-[2.5rem] border dark:border-slate-800 shadow-sm leading-loose text-lg text-slate-600 dark:text-slate-300 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <p>
              Hi, I'm <span className="text-blue-500 font-bold">Chien Huang (黃芊)</span>, a Digital IC &amp; Embedded Systems Engineer.
            </p>
            <p>
              Currently pursuing my Master's in CSIE at NCKU. I design efficient hardware and robust software. My work spans RISC-V SoCs, Hybrid PQC (Kyber/Dilithium) accelerators, and FreeRTOS embedded systems, backed by a solid foundation in full-stack development.
            </p>
            <p>
              Let's build something fast and efficient.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
               <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  <CheckCircle2 size={14} className="text-blue-500"/> Open for Collaboration
               </div>
               <div className="flex flex-wrap items-center gap-2">
                  {languageData.map((l, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      <span className="text-sm">{l.icon}</span> {l.name} · {l.cert}
                    </span>
                  ))}
               </div>
            </div>
          </div>
          {/* 裝飾性背景圖標 */}
          <Cpu size={120} className="absolute -right-8 -bottom-8 opacity-[0.03] dark:opacity-[0.05] -rotate-12" />
        </section>
      </header>

      {/* --- 2. Technical Stack --- */}
      <section>
        <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em] mb-6 flex items-center gap-3">
          <Code size={18}/> Technical Stack
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {technicalSkills.map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-[#0d1520] rounded-2xl border dark:border-slate-800 shadow-sm hover:translate-x-2 transition-transform">
              <div className="text-blue-500">{s.icon}</div>
              <span className="text-sm font-bold dark:text-slate-200">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. Education --- */}
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

      {/* --- 4. Publication --- */}
      <section>
        <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.3em] mb-8 flex items-center gap-3">
          <Award size={18}/> Publication
        </h3>
        <a
          href="https://ieeexplore.ieee.org/document/10808981"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-8 bg-white dark:bg-[#0d1520] rounded-3xl border-l-8 border-orange-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
            <h4 className="text-lg font-black dark:text-white leading-snug flex items-start gap-2 group-hover:text-orange-500 transition-colors">
              Live Demonstration: Low Cost AES-256 Circuit Design and Application
              <ExternalLink size={16} className="text-orange-500 shrink-0 mt-1" />
            </h4>
            <span className="text-[10px] font-black text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full w-fit shrink-0">
              IEEE APCCAS 2024
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
            C.-C. Chuang, Y.-L. Jheng, <span className="font-bold text-slate-900 dark:text-white">C. Huang</span>, L.-Y. Huang, P.-Y. Chen and N.-Y. Lee
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            2024 IEEE Asia Pacific Conference on Circuits and Systems (APCCAS), Taipei, Taiwan, pp. 811–811 · doi: 10.1109/APCCAS62602.2024.10808981
          </p>
        </a>
      </section>

    </motion.div>
  );
}