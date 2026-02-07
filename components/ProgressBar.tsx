
import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types';

interface ProgressBarProps {
  progress: number;
  height?: string;
  colorClass?: string;
  showLabel?: boolean;
  theme?: Theme;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = "h-2", 
  colorClass = "bg-blue-500",
  showLabel = false,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className={`flex justify-between mb-2 text-[10px] font-mono font-black ${isLight ? 'text-slate-400' : 'text-neutral-300'} uppercase tracking-widest`}>
          <span>FREMSKRIDT</span>
          <span className={isLight ? 'text-slate-900' : 'text-white'}>{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full ${height} ${isLight ? 'bg-slate-100' : 'bg-neutral-900'} rounded-full overflow-hidden border ${isLight ? 'border-slate-200' : 'border-neutral-700/50'} shadow-inner`}>
        <motion.div
          className={`h-full ${colorClass} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
