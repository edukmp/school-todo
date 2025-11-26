import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Alert,
    Modal,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTasks } from '@/context/TaskContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Image } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const { categories, refreshBranding, refreshCategories } = useTasks();
    const [activeTab, setActiveTab] = useState<'categories' | 'branding'>('categories');

    // Branding state
    const [appName, setAppName] = useState('School To-Do');
    const [appTagline, setAppTagline] = useState('Stay organized, stay ahead');
    const [logoUrl, setLogoUrl] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#5B9EF8');

    const handleLogoUpload = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission required', 'Please grant media library permissions');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
            });
            if (!result.canceled) {
                const asset = result.assets[0];
                const uri = asset.uri;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileExt = uri.split('.').pop();
                const fileName = `logo_${Date.now()}.${fileExt}`;
                const { data, error } = await supabase.storage.from('branding').upload(fileName, blob, {
                    upsert: true,
                    contentType: asset.type,
                });
                if (error) throw error;
                const { publicUrl } = supabase.storage.from('branding').getPublicUrl(data.path).data;
                setLogoUrl(publicUrl);
                Alert.alert('Success', 'Logo uploaded');
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to upload logo');
        }
    };

    const handleSaveBranding = async () => {
        try {
            const { error } = await supabase.from('branding').upsert({
                id: 'app',
                name: appName,
                tagline: appTagline,
                logo_url: logoUrl,
                primary_color: primaryColor,
            });
            if (error) throw error;
            await refreshBranding();
            Alert.alert('Saved', 'Branding settings updated!', [
                { text: 'OK', onPress: () => router.replace('/') }
            ]);
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save branding');
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Settings', headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            <SafeAreaView>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={styles.backButton} />
                </View>
            </SafeAreaView>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'categories' && styles.tabActive]}
                    onPress={() => setActiveTab('categories')}
                >
                    <Text style={[styles.tabText, activeTab === 'categories' && styles.tabTextActive]}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'branding' && styles.tabActive]}
                    onPress={() => setActiveTab('branding')}
                >
                    <Text style={[styles.tabText, activeTab === 'branding' && styles.tabTextActive]}>Branding</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {activeTab === 'categories' ? (
                    <CategoriesSection categories={categories} refreshCategories={refreshCategories} />
                ) : (
                    <BrandingSection
                        appName={appName}
                        setAppName={setAppName}
                        appTagline={appTagline}
                        setAppTagline={setAppTagline}
                        logoUrl={logoUrl}
                        onUploadLogo={handleLogoUpload}
                        primaryColor={primaryColor}
                        setPrimaryColor={setPrimaryColor}
                        onSave={handleSaveBranding}
                    />
                )}
            </ScrollView>
        </View>
    );
}

function CategoriesSection({ categories, refreshCategories }: { categories: any[], refreshCategories: () => Promise<void> }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryName, setCategoryName] = useState('');
    const [categoryIcon, setCategoryIcon] = useState('tag');
    const [categoryColor, setCategoryColor] = useState('#5B9EF8');

    const iconOptions = ['briefcase.fill', 'book.fill', 'headphones', 'airplane', 'house.fill', 'tag', 'bell', 'checkmark'];
    const colorOptions = ['#5B9EF8', '#FF9F47', '#FF7EB6', '#54E69D', '#9F7AEA', '#FF5757', '#FFA500', '#20B2AA'];

    const handleAddCategory = () => {
        setCategoryName('');
        setCategoryIcon('tag');
        setCategoryColor('#5B9EF8');
        setEditingCategory(null);
        setModalVisible(true);
    };

    const handleEditCategory = (category: any) => {
        setCategoryName(category.name);
        setCategoryIcon(category.icon);
        setCategoryColor(category.color);
        setEditingCategory(category);
        setModalVisible(true);
    };

    const handleSaveCategory = async () => {
        if (!categoryName.trim()) {
            Alert.alert('Error', 'Category name is required');
            return;
        }

        try {
            const categoryData = {
                name: categoryName,
                icon: categoryIcon,
                color: categoryColor,
            };

            if (editingCategory) {
                const { error } = await supabase
                    .from('categories')
                    .update(categoryData)
                    .eq('id', editingCategory.id);
                if (error) throw error;
                Alert.alert('Success', 'Category updated!');
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([categoryData]);
                if (error) throw error;
                Alert.alert('Success', 'Category created!');
            }

            await refreshCategories();
            setModalVisible(false);
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to save category');
        }
    };

    const handleDeleteCategory = async (category: any) => {
        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete "${category.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('categories')
                                .delete()
                                .eq('id', category.id);
                            if (error) throw error;
                            await refreshCategories();
                            Alert.alert('Success', 'Category deleted');
                        } catch (e) {
                            console.error(e);
                            Alert.alert('Error', 'Failed to delete category');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Manage Categories</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                    <IconSymbol name="plus" size={20} color="#FFF" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.categoryList}>
                {categories.filter(cat => cat.id !== 'all').map((category) => (
                    <View key={category.id} style={styles.categoryItem}>
                        <View style={styles.categoryLeft}>
                            <View style={[styles.categoryIconBox, { backgroundColor: `${category.color}15` }]}>
                                <IconSymbol name={category.icon as any} size={24} color={category.color} />
                            </View>
                            <View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <Text style={styles.categoryCount}>{category.taskCount} tasks</Text>
                            </View>
                        </View>
                        <View style={styles.categoryActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={() => handleEditCategory(category)}>
                                <IconSymbol name="pencil" size={18} color="#5B9EF8" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteCategory(category)}>
                                <IconSymbol name="trash" size={18} color="#FF5757" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingCategory ? 'Edit Category' : 'Add Category'}</Text>

                        <Text style={styles.inputLabel}>Category Name</Text>
                        <TextInput
                            style={styles.input}
                            value={categoryName}
                            onChangeText={setCategoryName}
                            placeholder="e.g., Homework, Personal"
                        />

                        <Text style={styles.inputLabel}>Choose Icon</Text>
                        <View style={styles.iconGrid}>
                            {iconOptions.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[styles.iconOption, categoryIcon === icon && styles.iconOptionSelected]}
                                    onPress={() => setCategoryIcon(icon)}
                                >
                                    <IconSymbol name={icon as any} size={24} color={categoryIcon === icon ? categoryColor : '#8E8E93'} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.inputLabel}>Choose Color</Text>
                        <View style={styles.colorGrid}>
                            {colorOptions.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[styles.colorOption, { backgroundColor: color }, categoryColor === color && styles.colorOptionSelected]}
                                    onPress={() => setCategoryColor(color)}
                                />
                            ))}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveCategory}>
                                <Text style={styles.modalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

function BrandingSection({
    appName,
    setAppName,
    appTagline,
    setAppTagline,
    logoUrl,
    onUploadLogo,
    primaryColor,
    setPrimaryColor,
    onSave,
}: {
    appName: string;
    setAppName: (v: string) => void;
    appTagline: string;
    setAppTagline: (v: string) => void;
    logoUrl: string;
    onUploadLogo: () => void;
    primaryColor: string;
    setPrimaryColor: (v: string) => void;
    onSave: () => void;
}) {
    const colorOptions = ['#5B9EF8', '#FF9F47', '#FF7EB6', '#54E69D', '#9F7AEA', '#FF5757'];

    return (
        <View>
            <Text style={styles.sectionTitle}>App Branding</Text>

            <Text style={styles.inputLabel}>App Name</Text>
            <TextInput
                style={styles.input}
                value={appName}
                onChangeText={setAppName}
                placeholder="School To-Do"
            />

            <Text style={styles.inputLabel}>Tagline</Text>
            <TextInput
                style={styles.input}
                value={appTagline}
                onChangeText={setAppTagline}
                placeholder="Stay organized, stay ahead"
            />

            <Text style={styles.inputLabel}>App Logo</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={onUploadLogo}>
                {logoUrl ? (
                    <Image source={{ uri: logoUrl }} style={styles.logoPreview} />
                ) : (
                    <View style={styles.uploadPlaceholder}>
                        <IconSymbol name="plus" size={32} color="#8E8E93" />
                        <Text style={styles.uploadText}>Upload Logo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Primary Color</Text>
            <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[styles.colorOption, { backgroundColor: color }, primaryColor === color && styles.colorOptionSelected]}
                        onPress={() => setPrimaryColor(color)}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAFAFA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
    tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
    tabActive: { borderBottomWidth: 2, borderBottomColor: '#5B9EF8' },
    tabText: { fontSize: 15, color: '#8E8E93', fontWeight: '500' },
    tabTextActive: { color: '#5B9EF8', fontWeight: '700' },
    content: { flex: 1 },
    contentContainer: { padding: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E' },
    addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#5B9EF8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 6 },
    addButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    categoryList: { gap: 12, marginBottom: 20 },
    categoryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12 },
    categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    categoryIconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    categoryName: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
    categoryCount: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
    categoryActions: { flexDirection: 'row', gap: 12 },
    actionButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15 },
    uploadButton: { marginTop: 8, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 12, overflow: 'hidden', height: 120, justifyContent: 'center', alignItems: 'center' },
    uploadPlaceholder: { alignItems: 'center', gap: 8 },
    uploadText: { fontSize: 14, color: '#8E8E93', fontWeight: '500' },
    logoPreview: { width: '100%', height: '100%', resizeMode: 'contain' },
    colorGrid: { flexDirection: 'row', gap: 12, marginTop: 8 },
    colorOption: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
    colorOptionSelected: { borderColor: '#1C1C1E' },
    saveButton: { backgroundColor: '#5B9EF8', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
    saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, maxHeight: '80%' },
    modalTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 20 },
    iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
    iconOption: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#F2F2F7', justifyContent: 'center', alignItems: 'center' },
    iconOptionSelected: { backgroundColor: '#E5F1FF' },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
    modalCancelButton: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#F2F2F7', alignItems: 'center' },
    modalCancelText: { fontSize: 16, fontWeight: '600', color: '#8E8E93' },
    modalSaveButton: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#5B9EF8', alignItems: 'center' },
    modalSaveText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
