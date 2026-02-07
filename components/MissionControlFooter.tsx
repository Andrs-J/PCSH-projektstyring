
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Activity, Target } from 'lucide-react';
import { Theme } from '../types';

interface MissionControlFooterProps {
  totalProgress: number;
  completedTasks: number;
  totalTasks: number;
  theme: Theme;
}

const MissionControlFooter: React.FC<MissionControlFooterProps> = ({ 
  totalProgress, 
  completedTasks, 
  totalTasks,
  theme
}) => {
  const radius = 22;
  const strokeWidth = 3;
  const size = 52; 
  const center = size / 2;
  const strokeDasharray = 2 * Math.PI * radius;

  const classes = {
    light: {
      footer: 'bg-white/95 border-slate-200 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]',
      iconBox: 'bg-slate-50 border-slate-200',
      text: 'text-slate-900',
      subtext: 'text-slate-500',
      label: 'text-cyan-600',
      progressBg: 'bg-slate-100 border-slate-200',
      circleTrack: 'text-slate-100',
      borderSep: 'border-slate-200'
    },
    dark: {
      footer: 'bg-[#1a1a1a]/98 border-neutral-800 shadow-[0_-15px_40px_-12px_rgba(0,0,0,0.8)]',
      iconBox: 'bg-neutral-800 border-neutral-700',
      text: 'text-white',
      subtext: 'text-neutral-400',
      label: 'text-cyan-500/80',
      progressBg: 'bg-neutral-900 border-neutral-800',
      circleTrack: 'text-neutral-800',
      borderSep: 'border-neutral-800'
    },
    medium: {
      footer: 'bg-[#3b4244]/98 border-[#4b5557] shadow-[0_-15px_40px_-12px_rgba(0,0,0,0.5)]',
      iconBox: 'bg-[#2d3436] border-[#4b5557]',
      text: 'text-[#dfe6e9]',
      subtext: 'text-[#dfe6e9]',
      label: 'text-cyan-400',
      progressBg: 'bg-[#2d3436] border-[#4b5557]',
      circleTrack: 'text-[#2d3436]',
      borderSep: 'border-[#4b5557]'
    }
  }[theme];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className={`${classes.footer} backdrop-blur-xl border rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:px-8 md:py-4 flex items-center gap-4 md:gap-6 transition-all duration-500`}>
          
          <div className={`hidden sm:flex items-center gap-3 border-r ${classes.borderSep} pr-6`}>
            <div className={`w-10 h-10 ${classes.iconBox} rounded-xl flex items-center justify-center border shadow-inner`}>
              <LayoutDashboard className="text-cyan-500" size={20} />
            </div>
            <div>
              <p className={`text-[8px] font-black ${classes.label} tracking-[0.2em] uppercase mb-0.5`}>Status</p>
              <h2 className={`text-base font-black ${classes.text} leading-none uppercase tracking-tight`}>Enabli</h2>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex gap-3 md:gap-5">
                 <div className={`flex items-center gap-1.5 ${classes.subtext}`}>
                   <Target size={12} className="text-cyan-500" />
                   <span className="text-[10px] font-mono font-bold">{completedTasks}/{totalTasks}</span>
                 </div>
                 <div className={`flex items-center gap-1.5 ${classes.subtext}`}>
                   <Activity size={12} className="text-emerald-500" />
                   <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden xs:inline">Aktiv</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-base md:text-xl font-black ${classes.text} font-mono tracking-tighter`}>
                  {Math.round(totalProgress)}%
                </span>
              </div>
            </div>
            
            <div className={`relative h-2 md:h-2.5 w-full ${classes.progressBg} rounded-full overflow-hidden border shadow-inner`}>
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: "circOut" }}
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] w-[30%] animate-[scan_3s_linear_infinite]" />
            </div>
          </div>

          <div className={`flex items-center justify-center pl-4 md:pl-6 border-l ${classes.borderSep}`}>
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 absolute">
                <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className={classes.circleTrack} />
                <motion.circle
                  cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: strokeDasharray }}
                  animate={{ strokeDashoffset: strokeDasharray - (strokeDasharray * totalProgress) / 100 }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                  className="text-cyan-500" strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col items-center justify-center z-10 select-none">
                <span className="text-[9px] md:text-[10px] font-mono font-bold text-cyan-600 leading-none">{Math.round(totalProgress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @media (max-width: 400px) {
          .xs\\:inline { display: inline; }
        }
      `}</style>
    </footer>
  );
};

export default MissionControlFooter;
