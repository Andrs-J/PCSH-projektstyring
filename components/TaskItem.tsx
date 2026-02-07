
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Trash2, CheckSquare, Square, StickyNote, ListTodo, Edit3, Link as LinkIcon, ExternalLink, X, Check } from 'lucide-react';
import { Task, SubTask, Theme, TaskLink } from '../types';
import ProgressBar from './ProgressBar';

interface TaskItemProps {
  task: Task;
  theme: Theme;
  accentColor: string;
  onUpdateTask: (updates: Partial<Task>) => void;
  onDeleteTask: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, theme, accentColor, onUpdateTask, onDeleteTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState(false);
  const [confirmDeleteSubtaskId, setConfirmDeleteSubtaskId] = useState<string | null>(null);
  const [confirmDeleteLinkId, setConfirmDeleteLinkId] = useState<string | null>(null);

  const completedSubtasksCount = task.subtasks.filter(s => s.completed).length;
  const totalSubtasksCount = task.subtasks.length;
  
  useEffect(() => {
    if (totalSubtasksCount > 0 && completedSubtasksCount === totalSubtasksCount && !task.completed) {
      onUpdateTask({ completed: true });
    } else if (totalSubtasksCount > 0 && completedSubtasksCount < totalSubtasksCount && task.completed) {
      onUpdateTask({ completed: false });
    }
  }, [completedSubtasksCount, totalSubtasksCount, task.completed]);

  const progress = task.completed ? 100 : (totalSubtasksCount > 0 ? (completedSubtasksCount / totalSubtasksCount) * 100 : 0);

  const handleToggleMaster = (e: React.MouseEvent) => {
    e.stopPropagation();
    const state = !task.completed;
    onUpdateTask({ completed: state, subtasks: task.subtasks.map(s => ({ ...s, completed: state })) });
  };

  const classes = {
    light: {
      item: isExpanded ? 'bg-white border-slate-300 shadow-md' : 'bg-slate-50 border-slate-200 hover:border-slate-300',
      text: 'text-slate-900', subtext: 'text-slate-500', input: 'bg-white border-slate-200', todoBg: 'hover:bg-slate-50'
    },
    dark: {
      item: isExpanded ? 'bg-[#1a1a1a] border-neutral-600 shadow-xl' : 'bg-[#121212] border-neutral-800 hover:border-neutral-700',
      text: 'text-white', subtext: 'text-neutral-500', input: 'bg-[#0d0d0d] border-neutral-800', todoBg: 'hover:bg-neutral-800/40'
    },
    medium: {
      item: isExpanded ? 'bg-[#3b4244] border-[#4b5557] shadow-xl' : 'bg-[#2d3436] border-[#4b5557] hover:border-[#636e72]',
      text: 'text-[#dfe6e9]', subtext: 'text-[#636e72]', input: 'bg-[#2d3436] border-[#4b5557]', todoBg: 'hover:bg-neutral-800/20'
    }
  }[theme];

  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${classes.item}`}>
      <div className="p-4 cursor-pointer flex items-center group select-none" onClick={() => setIsExpanded(!isExpanded)}>
        <button onClick={handleToggleMaster} className={`mr-4 p-1 transition-all duration-300 ${task.completed ? 'text-emerald-500' : 'text-neutral-500 hover:text-cyan-500'}`}>
          {task.completed ? <CheckSquare size={20} strokeWidth={2.5} /> : <Square size={20} strokeWidth={2} />}
        </button>
        <div className="flex-1 mr-4 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {isEditingTitle ? (
              <input autoFocus className={`bg-transparent border-b border-cyan-500 outline-none text-sm font-bold ${classes.text} w-full`} value={task.label} onClick={(e) => e.stopPropagation()} onBlur={() => setIsEditingTitle(false)} onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)} onChange={(e) => onUpdateTask({ label: e.target.value })} />
            ) : (
              <h4 className={`font-bold text-sm truncate ${task.completed ? 'text-emerald-500' : classes.text}`}>{task.label || 'Ny opgave'}</h4>
            )}
          </div>
          <ProgressBar progress={progress} theme={theme} height="h-1" colorClass={task.completed ? 'bg-emerald-500' : `bg-gradient-to-r ${accentColor}`} />
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); setIsEditingTitle(!isEditingTitle); }} className={`p-1.5 ${classes.subtext} hover:text-cyan-500`}><Edit3 size={16} /></button>
          
          {confirmDeleteTask ? (
            <div className="flex items-center gap-1 bg-red-500 p-0.5 rounded-lg">
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteTask(); }} 
                className="p-1 text-white hover:bg-white/20 rounded"
                title="Bekræft slet"
              >
                <Check size={14} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setConfirmDeleteTask(false); }} 
                className="p-1 text-white hover:bg-white/20 rounded"
                title="Fortryd"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); setConfirmDeleteTask(true); }} 
              className={`p-1.5 ${classes.subtext} hover:text-red-500`}
              title="Slet milepæl"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className={`p-5 pt-0 space-y-8 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/5'} mt-2`}>
              <div className="space-y-3 mt-5">
                <div className={`flex items-center gap-2 ${classes.subtext} text-[10px] font-black uppercase tracking-widest`}><StickyNote size={14} className="text-amber-500" /><span>Noter</span></div>
                <textarea value={task.notes} onChange={(e) => onUpdateTask({ notes: e.target.value })} placeholder="Dine noter her..." className={`w-full ${classes.input} rounded-xl p-4 text-xs ${classes.text} outline-none min-h-[100px] resize-none leading-relaxed shadow-inner border`} />
              </div>

              <div className="space-y-4">
                <div className={`flex items-center gap-2 ${classes.subtext} text-[10px] font-black uppercase tracking-widest`}><LinkIcon size={14} className="text-blue-500" /><span>Links</span></div>
                <div className="space-y-2">
                  {(task.links || []).map(link => (
                    <div key={link.id} className={`flex items-center justify-between p-3 rounded-xl ${classes.todoBg} group/link border border-transparent hover:border-blue-500/20 transition-all`}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-blue-500 hover:text-blue-400 font-bold truncate flex-1">
                        <ExternalLink size={14} className="shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </a>
                      
                      {confirmDeleteLinkId === link.id ? (
                        <div className="flex items-center gap-1 bg-red-500 p-0.5 rounded-lg shrink-0">
                          <button onClick={() => onUpdateTask({ links: task.links.filter(l => l.id !== link.id) })} className="p-1 text-white hover:bg-white/10 rounded"><Check size={12} /></button>
                          <button onClick={() => setConfirmDeleteLinkId(null)} className="p-1 text-white hover:bg-white/10 rounded"><X size={12} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteLinkId(link.id)} className="opacity-0 group-hover/link:opacity-100 p-1 text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newLinkUrl.trim()) return;
                    let url = newLinkUrl.trim();
                    if (!url.startsWith('http')) url = 'https://' + url;
                    onUpdateTask({ links: [...(task.links || []), { id: Math.random().toString(36).substr(2, 9), url, label: newLinkLabel.trim() || url }] });
                    setNewLinkUrl(''); setNewLinkLabel('');
                  }} className="flex flex-col gap-3 p-4 rounded-2xl bg-black/10 border border-white/5">
                    <div className="space-y-1">
                      <p className={`text-[8px] font-black uppercase tracking-[0.15em] ${classes.subtext} mb-1.5`}>Link Navn</p>
                      <input type="text" value={newLinkLabel} onChange={(e) => setNewLinkLabel(e.target.value)} placeholder="f.eks. Dokumentation" className={`w-full ${classes.input} border rounded-xl px-4 py-2.5 text-xs ${classes.text} outline-none focus:border-blue-500`} />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-[8px] font-black uppercase tracking-[0.15em] ${classes.subtext} mb-1.5`}>URL Adresse</p>
                      <div className="flex gap-2">
                        <input type="text" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="google.dk" className={`flex-1 ${classes.input} border rounded-xl px-4 py-2.5 text-xs ${classes.text} outline-none focus:border-blue-500`} />
                        <button type="submit" disabled={!newLinkUrl.trim()} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white px-5 rounded-xl transition-all flex items-center justify-center shrink-0">
                          <Plus size={18} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${classes.subtext} text-[10px] font-black uppercase tracking-widest`}><ListTodo size={14} className="text-cyan-500" /><span>Tjekliste</span></div>
                  <span className={`text-[10px] font-mono ${classes.subtext} font-bold`}>{completedSubtasksCount}/{totalSubtasksCount}</span>
                </div>
                <div className="space-y-1">
                  {task.subtasks.map(sub => (
                    <div key={sub.id} className={`flex items-center gap-3 group/sub p-3 rounded-xl ${classes.todoBg}`}>
                      <button onClick={() => onUpdateTask({ subtasks: task.subtasks.map(s => s.id === sub.id ? { ...s, completed: !s.completed } : s) })} className={sub.completed ? 'text-emerald-500' : 'text-neutral-500'}><CheckSquare size={18} /></button>
                      <input type="text" value={sub.label} onChange={(e) => onUpdateTask({ subtasks: task.subtasks.map(s => s.id === sub.id ? { ...s, label: e.target.value } : s) })} className={`bg-transparent text-xs flex-1 outline-none ${sub.completed ? 'text-neutral-500 line-through' : classes.text}`} />
                      
                      {confirmDeleteSubtaskId === sub.id ? (
                        <div className="flex items-center gap-1 bg-red-500 p-0.5 rounded-lg shrink-0">
                          <button onClick={() => onUpdateTask({ subtasks: task.subtasks.filter(s => s.id !== sub.id) })} className="p-1 text-white hover:bg-white/10 rounded"><Check size={12} /></button>
                          <button onClick={() => setConfirmDeleteSubtaskId(null)} className="p-1 text-white hover:bg-white/10 rounded"><X size={12} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteSubtaskId(sub.id)} className="opacity-0 group-hover/sub:opacity-100 text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newSubtask.trim()) return;
                    onUpdateTask({ subtasks: [...task.subtasks, { id: Math.random().toString(36).substr(2, 9), label: newSubtask, completed: false }], completed: false });
                    setNewSubtask('');
                  }} className="flex gap-2 mt-4">
                    <input type="text" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} placeholder="Nyt punkt..." className={`flex-1 ${classes.input} border rounded-xl px-4 py-2.5 text-xs ${classes.text} outline-none focus:border-cyan-500`} />
                    <button type="submit" disabled={!newSubtask.trim()} className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white px-5 rounded-xl transition-all"><Plus size={18} strokeWidth={3} /></button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskItem;
