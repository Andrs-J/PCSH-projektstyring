
export type Theme = 'light' | 'dark' | 'medium';

export interface TaskLink {
  id: string;
  url: string;
  label: string;
}

export interface SubTask {
  id: string;
  label: string;
  completed: boolean;
}

export interface Task {
  id: string;
  label: string;
  notes: string;
  completed: boolean;
  subtasks: SubTask[];
  links: TaskLink[];
}

export interface Phase {
  id: number;
  title: string;
  accentColor: string;
  glowColor: string;
  tasks: Task[];
}

export interface ProjectState {
  phases: Phase[];
  theme: Theme;
}
