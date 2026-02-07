
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plus, LayoutGrid, Edit2, AlertCircle, X, Check } from 'lucide-react';
import { Phase, Task, Theme } from '../types';
import ProgressBar from './ProgressBar';
import TaskItem from './TaskItem';

interface PhaseCardProps {
  phase: Phase;
  onUpdatePhase: (updates: Partial<Phase>) => void;
  onDeletePhase: () => void;
  theme: Theme;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, onUpdatePhase, onDeletePhase, theme }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const taskProgresses = phase.tasks.map(t => {
    if (t.completed) return 100;
    if (t.subtasks.length === 0) return 0;
    return (t.subtasks.filter(s => s.completed).length / t.subtasks.length) * 100;
  });
  
  const progress = taskProgresses.length > 0 
    ? taskProgresses.reduce((a, b) => a + b, 0) / taskProgresses.length 
    : 0;

  const isComplete = progress === 100 && phase.tasks.length > 0;

  const addTask = () => {
    if (!newTaskLabel.trim()) return;
    onUpdatePhase({
      tasks: [...phase.tasks, {
        id: Math.random().toString(36).substr(2, 9),
        label: newTaskLabel,
        notes: '',
        completed: false,
        subtasks: [],
        links: []
      }]
    });
    setNewTaskLabel('');
    setShowAdd(false);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    onUpdatePhase({ tasks: phase.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) });
  };

  const deleteTask = (taskId: string) => {
    onUpdatePhase({ tasks: phase.tasks.filter(t => t.id !== taskId) });
  };

  const classes = {
    light: {
      card: isComplete ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-slate-200 shadow-sm',
      text: 'text-slate-900', subtext: 'text-slate-500', 
      addBtn: 'border-slate-300 text-slate-400 hover:text-cyan-600 hover:border-cyan-300',
      deleteBtn: 'text-slate-400 hover:text-red-500'
    },
    dark: {
      card: isComplete ? 'bg-emerald-950/10 border-emerald-500/30' : 'bg-[#1e1e1e] border-neutral-800/80',
      text: 'text-white', subtext: 'text-neutral-400',
      addBtn: 'border-neutral-800 text-neutral-500 hover:text-cyan-400 hover:border-cyan-500/30',
      deleteBtn: 'text-neutral-600 hover:text-red-400'
    },
    medium: {
      card: 'bg-[#3b4244] border-[#4b5557]',
      text: 'text-[#dfe6e9]', subtext: 'text-[#b2bec3]',
      addBtn: 'border-[#4b5557] text-[#636e72] hover:text-cyan-400 hover:border-cyan-500/30',
      deleteBtn: 'text-[#636e72] hover:text-red-400'
    }
  }[theme];

  return (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} 
      className={`relative flex flex-col p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 shadow-2xl ${classes.card}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${phase.accentColor} flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg shadow-black/20`}>
            {phase.id}
          </div>
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <input autoFocus className={`bg-transparent border-b-2 border-cyan-500 outline-none text-xl md:text-2xl font-black ${classes.text} w-full`} value={phase.title} onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)} onChange={(e) => onUpdatePhase({ title: e.target.value })} />
            ) : (
              <h3 className={`text-xl md:text-2xl font-black tracking-tight ${classes.text} leading-tight cursor-pointer truncate flex items-center gap-2 group/title`} onClick={() => setIsEditingTitle(true)}>
                {phase.title}
                <Edit2 size={16} className="opacity-0 group-hover/title:opacity-100 transition-opacity hidden md:block" />
              </h3>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <LayoutGrid size={12} className={classes.subtext} />
              <p className={`text-[10px] md:text-[11px] ${classes.subtext} font-mono font-bold uppercase tracking-widest`}>{phase.tasks.length} Milepæle</p>
            </div>
          </div>
        </div>
        
        {isComplete && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="self-start md:self-auto bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 size={14} strokeWidth={3} /> FULDFØRT
          </motion.div>
        )}
      </div>

      <div className="flex-1 space-y-4 mb-10 relative z-10">
        <AnimatePresence mode="popLayout">
          {phase.tasks.map((task) => (
            <motion.div layout key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <TaskItem task={task} theme={theme} accentColor={phase.accentColor} onUpdateTask={(updates) => updateTask(task.id, updates)} onDeleteTask={() => deleteTask(task.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className="mt-8">
          {!showAdd ? (
            <button onClick={() => setShowAdd(true)} className={`w-full py-4 border-2 border-dashed rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest ${classes.addBtn}`}>
              <Plus size={18} strokeWidth={3} /> Tilføj Milepæl
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/10'} border rounded-[1.5rem] shadow-xl space-y-4`}>
              <p className={`text-[9px] font-black uppercase tracking-widest ${classes.subtext}`}>Navngiv din nye milepæl</p>
              <input autoFocus type="text" value={newTaskLabel} onChange={(e) => setNewTaskLabel(e.target.value)} placeholder="f.eks. Afventer feedback..." className={`w-full ${theme === 'light' ? 'bg-white' : 'bg-white/5'} border ${theme === 'light' ? 'border-slate-200' : 'border-white/10'} rounded-xl px-5 py-3.5 text-sm md:text-base ${classes.text} outline-none focus:border-cyan-500 transition-all font-medium`} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
              <div className="flex justify-end gap-4 pt-2">
                <button onClick={() => setShowAdd(false)} className={`text-[11px] font-black ${classes.subtext} hover:text-red-500 uppercase tracking-widest px-2 py-1`}>Afbryd</button>
                <button onClick={addTask} className="text-[11px] font-black text-white bg-cyan-600 hover:bg-cyan-500 px-6 py-2.5 rounded-xl shadow-lg transition-all uppercase tracking-widest">Opret</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className={`mt-auto pt-8 border-t relative z-20 ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
        <ProgressBar progress={progress} theme={theme} colorClass={`bg-gradient-to-r ${phase.accentColor}`} height="h-2.5" showLabel={true} />
        
        <div className="mt-8 flex justify-center">
          {confirmDelete ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter text-center">Er du helt sikker? Denne fase og alle opgaver slettes permanent</p>
              <div className="flex gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeletePhase(); }}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg transition-all active:scale-95"
                >
                  <Check size={12} strokeWidth={3} /> Slet permanent
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                  className="bg-neutral-600 hover:bg-neutral-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <X size={12} strokeWidth={3} /> Fortryd
                </button>
              </div>
            </motion.div>
          ) : (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 py-3 px-6 rounded-xl hover:bg-red-500/10 ${classes.deleteBtn}`}
            >
              <AlertCircle size={12} />
              Slet fase
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PhaseCard;
