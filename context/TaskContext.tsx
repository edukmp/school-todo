import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Category } from '@/types/task';

interface TaskContextType {
    tasks: Task[];
    categories: Category[];
    addTask: (task: Omit<Task, 'id'>) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    getTasksByCategory: (categoryId: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Sample data
const initialCategories: Category[] = [
    { id: 'all', name: 'All', icon: 'list.bullet', color: '#5B9EF8', taskCount: 23 },
    { id: 'work', name: 'Work', icon: 'briefcase.fill', color: '#FF9F43', taskCount: 14 },
    { id: 'music', name: 'Music', icon: 'headphones', color: '#FF6B9D', taskCount: 6 },
    { id: 'travel', name: 'Travel', icon: 'airplane', color: '#54E69D', taskCount: 1 },
    { id: 'study', name: 'Study', icon: 'book.fill', color: '#A084DC', taskCount: 2 },
    { id: 'home', name: 'Home', icon: 'house.fill', color: '#FF5757', taskCount: 14 },
];

const initialTasks: Task[] = [
    {
        id: '1',
        title: 'Call Max',
        date: '2025-04-29',
        time: '20:15',
        category: 'all',
        completed: false,
        status: 'late',
    },
    {
        id: '2',
        title: 'Practice piano',
        time: '16:00',
        category: 'music',
        completed: false,
        status: 'today',
    },
    {
        id: '3',
        title: 'Learn Spanish',
        time: '17:00',
        category: 'study',
        completed: false,
        status: 'today',
    },
    {
        id: '4',
        title: 'Finalize presentation',
        time: '14:00',
        category: 'work',
        completed: true,
        status: 'done',
    },
];

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const addTask = (task: Omit<Task, 'id'>) => {
        const newTask = {
            ...task,
            id: Date.now().toString(),
        };
        setTasks([...tasks, newTask]);

        // Update category count
        setCategories(categories.map(cat =>
            cat.id === task.category
                ? { ...cat, taskCount: cat.taskCount + 1 }
                : cat
        ));
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed, status: task.completed ? 'today' : 'done' }
                : task
        ));
    };

    const deleteTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
        setTasks(tasks.filter(t => t.id !== id));

        if (task) {
            setCategories(categories.map(cat =>
                cat.id === task.category
                    ? { ...cat, taskCount: cat.taskCount - 1 }
                    : cat
            ));
        }
    };

    const getTasksByCategory = (categoryId: string) => {
        if (categoryId === 'all') {
            return tasks;
        }
        return tasks.filter(task => task.category === categoryId);
    };

    return (
        <TaskContext.Provider value={{
            tasks,
            categories,
            addTask,
            toggleTask,
            deleteTask,
            getTasksByCategory,
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
