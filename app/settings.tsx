import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TextInput,
    Alert,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter, Stack } from 'expo-router';
import { useTasks } from '@/context/TaskContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { categories } = useTasks();
    const [activeTab, setActiveTab] = useState<'categories' | 'branding'>('categories');

    // Branding states
    const [appName, setAppName] = useState('School To-Do');
    const [appTagline, setAppTagline] = useState('Stay organized, stay ahead');

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Settings',
                    headerShown: false,
                }}
            />
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <SafeAreaView>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={styles.backButton} />
                </View>
            </SafeAreaView>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'categories' && styles.tabActive]}
                    onPress={() => setActiveTab('categories')}
                >
                    <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>
                        Categories
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'branding' && styles.tabActive]}
                    onPress={() => setActiveTab('branding')}
                >
                    <Text style={[styles.tabText, activeTab === 'branding' && styles.tabTextActive]}>
                        Branding
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {activeTab === 'categories' ? (
                    <CategoriesSection categories={categories} />
                ) : (
                    <BrandingSection
                        appName={appName}
                        setAppName={setAppName}
                        appTagline={appTagline}
                        setAppTagline={setAppTagline}
                    />
                )}
            </ScrollView>
        </View>
    );
}

// Categories Section Component
function CategoriesSection({ categories }: { categories: any[] }) {
    const router = useRouter();

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Manage Categories</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => Alert.alert('Add Category', 'Feature coming soon!')}
                >
                    <IconSymbol name="plus" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.categoryList}>
                {categories.map((category) => (
                    <View key={category.id} style={styles.categoryItem}>
                        <View style={styles.categoryLeft}>
                            <View style={[styles.categoryIconBox, { backgroundColor: category.color + '15' }]}>
                                <IconSymbol name={category.icon as any} size={24} color={category.color} />
                            </View>
                            <View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <Text style={styles.categoryCount}>{category.taskCount} tasks</Text>
                            </View>
                        </View>
                        <View style={styles.categoryActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => Alert.alert('Edit', `Edit ${category.name}`)}
                            >
                                <IconSymbol name="pencil" size={18} color="#5B9EF8" />
                            </TouchableOpacity>
                            {category.id !== 'all' && (
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => Alert.alert('Delete', `Delete ${category.name}?`)}
                                >
                                    <IconSymbol name="trash" size={18} color="#FF5757" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.infoBox}>
                <IconSymbol name="info.circle" size={20} color="#5B9EF8" />
                <Text style={styles.infoText}>
                    Categories help organize your tasks. The "All" category cannot be deleted.
                </Text>
            </View>
        </View>
    );
}

// Branding Section Component
function BrandingSection({
    appName,
    setAppName,
    appTagline,
    setAppTagline
}: {
    appName: string;
    setAppName: (val: string) => void;
    appTagline: string;
    setAppTagline: (val: string) => void;
}) {
    return (
        <View>
            <Text style={styles.sectionTitle}>App Branding</Text>

            {/* App Name */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>App Name</Text>
                <TextInput
                    style={styles.input}
                    value={appName}
                    onChangeText={setAppName}
                    placeholder="Enter app name"
                    placeholderTextColor="#8E8E93"
                />
            </View>

            {/* App Tagline */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Tagline</Text>
                <TextInput
                    style={styles.input}
                    value={appTagline}
                    onChangeText={setAppTagline}
                    placeholder="Enter tagline"
                    placeholderTextColor="#8E8E93"
                />
            </View>

            {/* Logo Upload */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>App Logo</Text>
                <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => Alert.alert('Upload Logo', 'Feature coming soon!')}
                >
                    <IconSymbol name="photo" size={32} color="#8E8E93" />
                    <Text style={styles.uploadText}>Tap to upload logo</Text>
                    <Text style={styles.uploadSubtext}>PNG, JPG (max 2MB)</Text>
                </TouchableOpacity>
            </View>

            {/* Theme Color */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Primary Color</Text>
                <View style={styles.colorPicker}>
                    {['#5B9EF8', '#FF9500', '#54E69D', '#FF5757', '#AF52DE', '#7E7EF8'].map((color) => (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorOption, { backgroundColor: color }]}
                            onPress={() => Alert.alert('Color Selected', color)}
                        />
                    ))}
                </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => Alert.alert('Saved', 'Branding settings updated!')}
            >
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <IconSymbol name="info.circle" size={20} color="#5B9EF8" />
                <Text style={styles.infoText}>
                    Branding changes will apply to the entire app and be visible to all users.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#5B9EF8',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#8E8E93',
    },
    tabTextActive: {
        color: '#5B9EF8',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5B9EF8',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    categoryList: {
        gap: 12,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    categoryLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 2,
    },
    categoryCount: {
        fontSize: 13,
        color: '#8E8E93',
    },
    categoryActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1C1C1E',
    },
    uploadBox: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#E5E5EA',
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        gap: 8,
    },
    uploadText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1C1C1E',
    },
    uploadSubtext: {
        fontSize: 13,
        color: '#8E8E93',
    },
    colorPicker: {
        flexDirection: 'row',
        gap: 12,
        flexWrap: 'wrap',
    },
    colorOption: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    saveButton: {
        backgroundColor: '#5B9EF8',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E8F4FD',
        padding: 16,
        borderRadius: 12,
        gap: 12,
        marginTop: 24,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1C1C1E',
        lineHeight: 18,
    },
});
