
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Monitor, Settings, Sun, Moon, Coffee, Plus } from 'lucide-react';
import PhaseCard from './components/PhaseCard';
import MissionControlFooter from './components/MissionControlFooter';
import { INITIAL_PHASES } from './constants';
import { Phase, ProjectState, Theme } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ProjectState>(() => {
    const saved = localStorage.getItem('enabli-project-state');
    return saved ? JSON.parse(saved) : { phases: INITIAL_PHASES, theme: 'medium' };
  });

  useEffect(() => {
    localStorage.setItem('enabli-project-state', JSON.stringify(state));
  }, [state]);

  const updatePhase = (phaseId: number, updates: Partial<Phase>) => {
    setState(prevState => ({
      ...prevState,
      phases: prevState.phases.map(phase => 
        phase.id === phaseId ? { ...phase, ...updates } : phase
      ),
    }));
  };

  const addPhase = () => {
    const nextId = state.phases.length > 0 ? Math.max(...state.phases.map(p => p.id)) + 1 : 1;
    const colors = [
      "from-cyan-400 to-blue-500",
      "from-purple-400 to-fuchsia-600",
      "from-emerald-400 to-teal-600",
      "from-amber-400 to-orange-500",
      "from-rose-400 to-pink-600",
      "from-indigo-400 to-violet-600"
    ];
    const newPhase: Phase = {
      id: nextId,
      title: `Fase ${nextId}: Ny Fase`,
      accentColor: colors[(nextId - 1) % colors.length],
      glowColor: "rgba(255, 255, 255, 0.1)",
      tasks: []
    };
    setState(prev => ({ ...prev, phases: [...prev.phases, newPhase] }));
  };

  const deletePhase = (phaseId: number) => {
    setState(prev => ({
      ...prev,
      phases: prev.phases.filter(p => p.id !== phaseId)
    }));
  };

  const setTheme = (theme: Theme) => {
    setState(prev => ({ ...prev, theme }));
  };

  const stats = useMemo(() => {
    let totalPhasesProgress = 0;
    let totalSubtasks = 0;
    let completedSubtasks = 0;
    
    state.phases.forEach(phase => {
      const taskProgresses = phase.tasks.map(t => {
        if (t.completed) {
            const count = t.subtasks.length > 0 ? t.subtasks.length : 1;
            totalSubtasks += count;
            completedSubtasks += count;
            return 100;
        }
        const subCount = t.subtasks.length;
        const compCount = t.subtasks.filter(s => s.completed).length;
        if (subCount > 0) {
            totalSubtasks += subCount;
            completedSubtasks += compCount;
            return (compCount / subCount) * 100;
        } else {
            totalSubtasks += 1;
            return 0;
        }
      });
      const phaseProgress = taskProgresses.length > 0 
        ? taskProgresses.reduce((a, b) => a + b, 0) / taskProgresses.length 
        : 0;
      totalPhasesProgress += phaseProgress;
    });

    const totalProgress = state.phases.length > 0 ? totalPhasesProgress / state.phases.length : 0;
    return { totalProgress, completedTasks: completedSubtasks, totalTasks: totalSubtasks };
  }, [state.phases]);

  const themeClasses = {
    light: { bg: 'bg-slate-50', text: 'text-slate-900', subtext: 'text-slate-600', grid: 'opacity-[0.1] invert' },
    dark: { bg: 'bg-[#121212]', text: 'text-white', subtext: 'text-neutral-400', grid: 'opacity-[0.05]' },
    medium: { bg: 'bg-[#2d3436]', text: 'text-[#dfe6e9]', subtext: 'text-[#b2bec3]', grid: 'opacity-[0.08]' }
  }[state.theme];

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} pb-64 selection:bg-cyan-500/30 transition-colors duration-500 overflow-x-hidden`}>
      <div className={`fixed inset-0 pointer-events-none ${themeClasses.grid}`} style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <header className="relative pt-6 md:pt-12 pb-10 px-4 max-w-4xl mx-auto text-center">
        <div className="flex justify-end items-center mb-8 md:mb-12">
          <div className={`${state.theme === 'light' ? 'bg-white/80' : 'bg-black/20'} backdrop-blur-md p-1 rounded-xl border ${state.theme === 'light' ? 'border-slate-200' : 'border-white/10'} flex gap-0.5 shadow-sm`}>
            {[
              { id: 'light', icon: Sun },
              { id: 'medium', icon: Coffee },
              { id: 'dark', icon: Moon }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={`p-2 md:p-1.5 rounded-lg transition-all duration-300 ${
                  state.theme === t.id ? 'bg-cyan-500 text-white shadow-md' : `${themeClasses.subtext} hover:text-cyan-400`
                }`}
              >
                <t.icon size={16} className="md:w-3.5 md:h-3.5" />
              </button>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">ENABLI</h1>
          <div className="flex flex-col items-center justify-center gap-6">
            <p className={`text-base md:text-xl ${themeClasses.subtext} font-light max-w-md px-4`}>
              Digital skiltning & hospitalets <span className="font-bold text-cyan-500">kommunikationsinfrastruktur</span>.
            </p>
            <div className="flex gap-6 md:gap-8 py-4 border-t border-neutral-700/20 w-full max-w-sm justify-center">
               {[
                 { icon: <Monitor className="w-5 h-5 md:w-6 md:h-6" />, label: "Player" },
                 { icon: <Settings className="w-5 h-5 md:w-6 md:h-6" />, label: "CMS" },
                 { icon: <Layers className="w-5 h-5 md:w-6 md:h-6" />, label: "Hardware" }
               ].map((item, i) => (
                 <div key={i} className={`flex flex-col items-center gap-1.5 ${themeClasses.subtext}`}>
                   <div className="text-cyan-500">{item.icon}</div>
                   <span className="text-[9px] md:text-[10px] font-mono uppercase font-bold tracking-widest">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-10">
          <AnimatePresence mode="popLayout">
            {state.phases.map((phase) => (
              <PhaseCard 
                key={phase.id} 
                phase={phase} 
                theme={state.theme}
                onUpdatePhase={(updates) => updatePhase(phase.id, updates)}
                onDeletePhase={() => deletePhase(phase.id)}
              />
            ))}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={addPhase}
            className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 min-h-[180px] ${
              state.theme === 'light' 
              ? 'bg-slate-100 border-slate-300 text-slate-400 hover:border-cyan-400 hover:text-cyan-600 shadow-sm' 
              : 'bg-white/5 border-white/10 text-white/20 hover:border-cyan-500/50 hover:text-cyan-400 shadow-xl'
            }`}
          >
            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-3">
              <Plus size={24} strokeWidth={3} />
            </div>
            <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Tilføj ny projektfase</span>
          </motion.button>
        </div>
      </main>

      <MissionControlFooter 
        totalProgress={stats.totalProgress}
        completedTasks={stats.completedTasks}
        totalTasks={stats.totalTasks}
        theme={state.theme}
      />
    </div>
  );
};

export default App;
