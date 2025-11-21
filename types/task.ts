export interface Task {
  id: string;
  title: string;
  date?: string;
  time?: string;
  note?: string;
  category: string;
  completed: boolean;
  status: 'late' | 'today' | 'done' | 'upcoming';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  taskCount: number;
}
