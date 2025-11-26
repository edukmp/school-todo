import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Category } from '@/types/task';
import { supabase } from '@/lib/supabase';
import { scheduleTaskNotification } from '@/lib/notifications';

export interface Branding {
    name: string;
    tagline: string;
    logoUrl: string;
    primaryColor: string;
}

interface TaskContextType {
    tasks: Task[];
    categories: Category[];
    branding: Branding;
    addTask: (task: Omit<Task, 'id'>) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    getTasksByCategory: (categoryId: string) => Task[];
    refreshBranding: () => Promise<void>;
    refreshCategories: () => Promise<void>;
    isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [baseCategories, setBaseCategories] = useState<Omit<Category, 'taskCount'>[]>([
        { id: 'all', name: 'All', icon: 'list.bullet', color: '#5B9EF8' },
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [branding, setBranding] = useState<Branding>({
        name: 'School To-Do',
        tagline: 'Stay organized, stay ahead',
        logoUrl: '',
        primaryColor: '#5B9EF8',
    });

    const fetchTasks = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from('todostb_tasks').select('*');
        if (error) console.error('Error fetching tasks:', error);
        else if (data) setTasks(data as Task[]);
        setIsLoading(false);
    };

    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) {
            console.error('Error fetching categories:', error);
        } else if (data) {
            const allCategory = { id: 'all', name: 'All', icon: 'list.bullet', color: '#5B9EF8' };
            setBaseCategories([allCategory, ...data.map(cat => ({
                id: cat.id,
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
            }))]);
        }
    };

    const fetchBranding = async () => {
        const { data, error } = await supabase
            .from('branding')
            .select('*')
            .eq('id', 'app')
            .single();

        if (data) {
            setBranding({
                name: data.name || 'School To-Do',
                tagline: data.tagline || 'Stay organized, stay ahead',
                logoUrl: data.logo_url || '',
                primaryColor: data.primary_color || '#5B9EF8',
            });
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchBranding();
        fetchCategories();
    }, []);

    const addTask = async (newTask: Omit<Task, 'id'>) => {
        const tempId = Math.random().toString(36).substring(2, 15);
        const optimisticTask: Task = { ...newTask, id: tempId } as Task;
        setTasks(prev => [optimisticTask, ...prev]);

        scheduleTaskNotification(optimisticTask);

        try {
            const { data, error } = await supabase
                .from('todostb_tasks')
                .insert([newTask])
                .select()
                .single();
            if (error) throw error;
            if (data) setTasks(prev => prev.map(t => (t.id === tempId ? (data as Task) : t)));
        } catch (err) {
            console.error('Error adding task:', err);
            fetchTasks();
        }
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        const newCompleted = !task.completed;
        const newStatus = newCompleted ? 'done' : 'today';
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted, status: newStatus } : t));
        try {
            const { error } = await supabase
                .from('todostb_tasks')
                .update({ completed: newCompleted, status: newStatus })
                .eq('id', id);
            if (error) throw error;
        } catch (err) {
            console.error('Error toggling task:', err);
            fetchTasks();
        }
    };

    const deleteTask = async (id: string) => {
        const previous = [...tasks];
        setTasks(prev => prev.filter(t => t.id !== id));
        try {
            const { error } = await supabase.from('todostb_tasks').delete().eq('id', id);
            if (error) throw error;
        } catch (err) {
            console.error('Error deleting task:', err);
            setTasks(previous);
        }
    };

    const getTasksByCategory = (categoryId: string): Task[] => {
        if (categoryId === 'all') return tasks;
        return tasks.filter(task => task.category === categoryId);
    };

    const categories: Category[] = baseCategories.map(cat => {
        const count = cat.id === 'all' ? tasks.length : tasks.filter(t => t.category === cat.id).length;
        return { ...cat, taskCount: count };
    });

    return (
        <TaskContext.Provider
            value={{
                tasks,
                categories,
                branding,
                addTask,
                toggleTask,
                deleteTask,
                getTasksByCategory,
                refreshBranding: fetchBranding,
                refreshCategories: fetchCategories,
                isLoading,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within a TaskProvider');
    return context;
}

