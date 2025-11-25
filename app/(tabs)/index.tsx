import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTasks } from '@/context/TaskContext';
import { useRouter } from 'expo-router';

export default function ListsScreen() {
  const { categories, isLoading } = useTasks();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B9EF8" />
      </View>
    );
  }

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/task-list/${categoryId}` as any);
  };

  // Responsive Layout Logic with landscape detection
  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  // Determine number of columns
  let numColumns = 2; // Default for portrait mobile
  if (isDesktop) {
    numColumns = 4;
  } else if (isTablet) {
    numColumns = 3;
  } else if (isLandscape) {
    numColumns = 3; // 3 columns in landscape on mobile
  }

  const containerPadding = 16;
  const gap = 12;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.contentWrapper, { maxWidth: isTablet ? 900 : '100%', alignSelf: 'center', width: '100%' }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <IconSymbol name="line.horizontal.3" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <IconSymbol name="gearshape" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Lists</Text>
        </View>

        {/* Categories Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.gridContainer, { paddingHorizontal: containerPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.grid, { gap, justifyContent: 'flex-start' }]}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {
                    width: numColumns === 2 ? '48%' : numColumns === 3 ? '31.5%' : '23%',
                  }
                ]}
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
      </View>

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
  contentWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap is handled via inline style for dynamic calculation, but we can keep it here for older RN versions if needed, 
    // though inline style overrides it.
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    minHeight: 140,
    marginBottom: 12, // Still keep margin bottom for vertical spacing if gap doesn't work on some platforms, but gap is better.
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
});
