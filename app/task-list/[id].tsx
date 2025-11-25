import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTasks } from '@/context/TaskContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Task } from '@/types/task';

export default function TaskListScreen() {
    const { tasks, categories, toggleTask } = useTasks();
    const router = useRouter();
    const params = useLocalSearchParams();
    const categoryId = params.id as string;
    const { width } = useWindowDimensions();

    const category = categories.find(c => c.id === categoryId);
    const categoryTasks = categoryId === 'all'
        ? tasks
        : tasks.filter(t => t.category === categoryId);

    // Group tasks by status
    const lateTasks = categoryTasks.filter(t => t.status === 'late');
    const todayTasks = categoryTasks.filter(t => t.status === 'today');
    const doneTasks = categoryTasks.filter(t => t.status === 'done');

    const isTablet = width >= 768;

    const renderTask = (task: Task) => {
        const taskCategory = categories.find(c => c.id === task.category);

        return (
            <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => toggleTask(task.id)}
                activeOpacity={0.7}
            >
                {/* Category Icon */}
                <View style={[styles.taskIcon, { backgroundColor: taskCategory?.color + '15' || '#5B9EF815' }]}>
                    <IconSymbol
                        name={taskCategory?.icon as any || 'list.bullet'}
                        size={20}
                        color={taskCategory?.color || '#5B9EF8'}
                    />
                </View>

                <View style={styles.taskContent}>
                    <Text style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted
                    ]}>
                        {task.title}
                    </Text>
                    {task.time && (
                        <Text style={styles.taskTime}>
                            {task.date ? `${task.date} - ${task.time}` : task.time}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.checkbox,
                        task.completed && styles.checkboxCompleted
                    ]}
                    onPress={() => toggleTask(task.id)}
                >
                    {task.completed && (
                        <IconSymbol name="checkmark" size={16} color="#FFF" />
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const renderSection = (title: string, tasks: Task[], textColor: string) => {
        if (tasks.length === 0) return null;

        return (
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
                {tasks.map(renderTask)}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={[styles.contentWrapper, { maxWidth: isTablet ? 800 : '100%', alignSelf: 'center', width: '100%' }]}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: category?.color || '#5B9EF8' }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <IconSymbol name="chevron.left" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuButton}>
                        <IconSymbol name="ellipsis" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Category Info */}
                <View style={[styles.categoryInfo, { backgroundColor: category?.color || '#5B9EF8' }]}>
                    <View style={styles.categoryIconContainer}>
                        <IconSymbol name={category?.icon as any || 'list.bullet'} size={28} color="#FFF" />
                    </View>
                    <Text style={styles.categoryTitle}>{category?.name || 'All'}</Text>
                    <Text style={styles.categoryTaskCount}>
                        {categoryTasks.length} Task{categoryTasks.length !== 1 ? 's' : ''}
                    </Text>
                </View>

                {/* Task List */}
                <ScrollView
                    style={styles.taskList}
                    contentContainerStyle={styles.taskListContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderSection('Late', lateTasks, '#FF5757')}
                    {renderSection('Today', todayTasks, '#000')}
                    {renderSection('Done', doneTasks, '#8E8E93')}
                </ScrollView>

                {/* Floating Add Button */}
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: category?.color || '#5B9EF8' }]}
                    onPress={() => router.push('/modal')}
                    activeOpacity={0.8}
                >
                    <IconSymbol name="plus" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    contentWrapper: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    categoryInfo: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    categoryIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    categoryTaskCount: {
        fontSize: 16,
        color: '#FFF',
        opacity: 0.9,
    },
    taskList: {
        flex: 1,
        marginTop: -10,
    },
    taskListContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'capitalize',
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    taskIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    taskContent: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 4,
    },
    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: '#8E8E93',
    },
    taskTime: {
        fontSize: 13,
        color: '#FF5757',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D1D6',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    checkboxCompleted: {
        backgroundColor: '#5B9EF8',
        borderColor: '#5B9EF8',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#5B9EF8',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});
