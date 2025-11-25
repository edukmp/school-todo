import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTasks } from '@/context/TaskContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TaskDetailScreen() {
    const { tasks, categories, toggleTask, deleteTask } = useTasks();
    const router = useRouter();
    const params = useLocalSearchParams();
    const taskId = params.id as string;

    const task = tasks.find(t => t.id === taskId);
    const category = categories.find(c => c.id === task?.category);

    if (!task) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Task not found</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: category?.color || '#5B9EF8' }]}>
                <SafeAreaView>
                    <View style={styles.headerTop}>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.back()}
                        >
                            <IconSymbol name="chevron.left" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => deleteTask(taskId).then(() => router.back())}
                        >
                            <IconSymbol name="trash" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Task Title */}
                <View style={styles.section}>
                    <View style={styles.iconCircle}>
                        <IconSymbol name={category?.icon as any || 'list.bullet'} size={24} color={category?.color || '#5B9EF8'} />
                    </View>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                </View>

                {/* Date & Time */}
                {(task.date || task.time) && (
                    <View style={styles.section}>
                        <View style={styles.detailRow}>
                            <IconSymbol name="calendar" size={20} color="#8E8E93" />
                            <Text style={styles.detailLabel}>Due Date</Text>
                        </View>
                        <Text style={styles.detailValue}>
                            {task.date && task.time ? `${task.date} at ${task.time}` : task.date || task.time}
                        </Text>
                    </View>
                )}

                {/* Category */}
                <View style={styles.section}>
                    <View style={styles.detailRow}>
                        <IconSymbol name="tag" size={20} color="#8E8E93" />
                        <Text style={styles.detailLabel}>Category</Text>
                    </View>
                    <View style={[styles.categoryBadge, { backgroundColor: category?.color + '20' || '#5B9EF820' }]}>
                        <Text style={[styles.categoryText, { color: category?.color || '#5B9EF8' }]}>
                            {category?.name || 'Uncategorized'}
                        </Text>
                    </View>
                </View>

                {/* Status */}
                <View style={styles.section}>
                    <View style={styles.detailRow}>
                        <IconSymbol name="checkmark.circle" size={20} color="#8E8E93" />
                        <Text style={styles.detailLabel}>Status</Text>
                    </View>
                    <Text style={[
                        styles.statusText,
                        { color: task.completed ? '#54E69D' : task.status === 'late' ? '#FF5757' : '#5B9EF8' }
                    ]}>
                        {task.completed ? 'Completed' : task.status === 'late' ? 'Overdue' : 'In Progress'}
                    </Text>
                </View>

                {/* Note */}
                {task.note && (
                    <View style={styles.section}>
                        <View style={styles.detailRow}>
                            <IconSymbol name="text.bubble" size={20} color="#8E8E93" />
                            <Text style={styles.detailLabel}>Notes</Text>
                        </View>
                        <Text style={styles.noteText}>{task.note}</Text>
                    </View>
                )}

                {/* Complete Button */}
                <TouchableOpacity
                    style={[
                        styles.completeButton,
                        { backgroundColor: task.completed ? '#8E8E93' : category?.color || '#5B9EF8' }
                    ]}
                    onPress={() => toggleTask(taskId)}
                >
                    <IconSymbol
                        name={task.completed ? "arrow.counterclockwise" : "checkmark"}
                        size={20}
                        color="#FFF"
                    />
                    <Text style={styles.completeButtonText}>
                        {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    header: {
        paddingTop: 0,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -10,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F0F2F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    taskTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1C1C1E',
        lineHeight: 36,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        marginLeft: 8,
    },
    detailValue: {
        fontSize: 16,
        color: '#1C1C1E',
        fontWeight: '500',
    },
    categoryBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
    },
    noteText: {
        fontSize: 15,
        color: '#1C1C1E',
        lineHeight: 22,
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#8E8E93',
        marginBottom: 20,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#5B9EF8',
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
