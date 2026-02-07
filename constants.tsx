
import { Phase } from './types';

export const INITIAL_PHASES: Phase[] = [
  {
    id: 1,
    title: "Fase 1: Full-stack Opsætning",
    accentColor: "from-cyan-400 to-blue-500",
    glowColor: "rgba(34, 211, 238, 0.2)",
    tasks: [
      { 
        id: "1-1", 
        label: "Convex Backend", 
        notes: "Database & GraphQL API opsætning",
        completed: false,
        subtasks: [{ id: "1-1-1", label: "Schema design", completed: false }],
        links: []
      },
      { 
        id: "1-2", 
        label: "Expo Framework", 
        notes: "Konfiguration til React Native/Web",
        completed: false,
        subtasks: [{ id: "1-2-1", label: "Initialisering", completed: false }],
        links: []
      },
      { 
        id: "1-3", 
        label: "Vercel Hosting", 
        notes: "CI/CD pipeline udrulning",
        completed: false,
        subtasks: [{ id: "1-3-1", label: "Opsæt webhooks", completed: false }],
        links: []
      }
    ]
  },
  {
    id: 2,
    title: "Fase 2: PWA Player",
    accentColor: "from-purple-400 to-fuchsia-600",
    glowColor: "rgba(232, 121, 249, 0.2)",
    tasks: [
      { id: "2-1", label: "Responsivt Design", notes: "Web Player optimering", completed: false, subtasks: [], links: [] },
      { id: "2-2", label: "Offline Funktionalitet", notes: "Cache Strategi", completed: false, subtasks: [], links: [] },
      { id: "2-3", label: "Auto-sync", notes: "Glidende Overgange", completed: false, subtasks: [], links: [] }
    ]
  },
  {
    id: 3,
    title: "Fase 3: Hardware & OS",
    accentColor: "from-emerald-400 to-teal-600",
    glowColor: "rgba(52, 211, 153, 0.2)",
    tasks: [
      { id: "3-1", label: "Raspberry Pi Setup", notes: "Installation & Konfig", completed: false, subtasks: [], links: [] },
      { id: "3-2", label: "Linux OS Optimering", notes: "Drivere og kernel tweaks", completed: false, subtasks: [], links: [] },
      { id: "3-3", label: "HDMI-CEC Integration", notes: "Strømstyring", completed: false, subtasks: [], links: [] },
      { id: "3-4", label: "Planlægningsscripts", notes: "Automatisering", completed: false, subtasks: [], links: [] }
    ]
  },
  {
    id: 4,
    title: "Fase 4: Admin & CMS",
    accentColor: "from-amber-400 to-orange-500",
    glowColor: "rgba(251, 191, 36, 0.2)",
    tasks: [
      { id: "4-1", label: "Admin App & NOC", notes: "Realtidsovervågning", completed: false, subtasks: [], links: [] },
      { id: "4-2", label: "TRT-hub", notes: "Centraliseret CMS", completed: false, subtasks: [], links: [] },
      { id: "4-3", label: "Lokaliseret CMS", notes: "Dashboards til 8 afdelinger", completed: false, subtasks: [], links: [] }
    ]
  },
  {
    id: 5,
    title: "Fase 5: Pilottest",
    accentColor: "from-rose-400 to-pink-600",
    glowColor: "rgba(251, 113, 133, 0.2)",
    tasks: [
      { id: "5-1", label: "Fysisk Installation", notes: "Hardware/Software på lokation", completed: false, subtasks: [], links: [] },
      { id: "5-2", label: "Brugertests", notes: "Feedback fra personale & patienter", completed: false, subtasks: [], links: [] },
      { id: "5-3", label: "Systemoptimering", notes: "Baseret på pilotdata", completed: false, subtasks: [], links: [] }
    ]
  },
  {
    id: 6,
    title: "Fase 6: Udrulning",
    accentColor: "from-indigo-400 to-violet-600",
    glowColor: "rgba(129, 140, 248, 0.2)",
    tasks: [
      { id: "6-1", label: "Afdelingsudrulning", notes: "Udrulning til resterende 7 afdelinger", completed: false, subtasks: [], links: [] },
      { id: "6-2", label: "Træning", notes: "Uddannelse af personale", completed: false, subtasks: [], links: [] },
      { id: "6-3", label: "Migration", notes: "Tilpasning af indhold", completed: false, subtasks: [], links: [] },
      { id: "6-4", label: "Support Setup", notes: "Løbende vedligehold", completed: false, subtasks: [], links: [] }
    ]
  }
];
