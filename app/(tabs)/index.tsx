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
import { useRouter } from 'expo-router';

export default function ListsScreen() {
  const { categories } = useTasks();
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/task-list/${categoryId}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <IconSymbol name="line.horizontal.3" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Lists</Text>
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
                <IconSymbol name={category.icon as any} size={32} color={category.color} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.taskCount}>
                {category.taskCount} Task{category.taskCount !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modal')}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '48%',
    minHeight: 140,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  taskCount: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#5B9EF8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B9EF8',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
});
