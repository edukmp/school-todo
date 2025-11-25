import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTasks } from '@/context/TaskContext';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewTaskModal() {
  const { addTask, categories } = useTasks();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [category, setCategory] = useState('all');
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);

  const isTablet = width >= 768;

  const handleCreate = () => {
    if (title.trim()) {
      addTask({
        title: title.trim(),
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        note: note,
        category: category,
        completed: false,
        status: 'today',
      });
      router.back();
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setShowTimePicker(true); // Show time picker after date
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const selectedCategory = categories.find(c => c.id === category);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.contentWrapper, { maxWidth: isTablet ? 600 : '100%', alignSelf: 'center', width: '100%' }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>New task</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <IconSymbol name="xmark" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Title Input */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>What are you planning?</Text>
              <TextInput
                style={styles.titleInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Task title"
                placeholderTextColor="#C7C7CC"
                autoFocus
              />
            </View>

            {/* Date/Time Selection */}
            {Platform.OS === 'web' ? (
              <View style={styles.dateInputContainer}>
                <IconSymbol name="bell" size={20} color="#8E8E93" style={styles.inputIcon} />
                {React.createElement('input', {
                  type: 'datetime-local',
                  value: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16),
                  onChange: (e: any) => setDate(new Date(e.target.value)),
                  style: {
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    color: '#000',
                    height: '100%',
                  }
                })}
              </View>
            ) : (
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <IconSymbol name="bell" size={20} color="#8E8E93" />
                <Text style={styles.optionText}>
                  {formatDateTime(date)}
                </Text>
              </TouchableOpacity>
            )}

            {/* Note Input */}
            <View>
              <TouchableOpacity
                style={styles.option}
                onPress={() => setIsNoteVisible(!isNoteVisible)}
              >
                <IconSymbol name="text.bubble" size={20} color="#8E8E93" />
                <Text style={styles.optionText}>
                  {note ? 'Edit note' : 'Add note'}
                </Text>
              </TouchableOpacity>

              {isNoteVisible && (
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add details..."
                  multiline
                  numberOfLines={3}
                />
              )}
            </View>

            {/* Category Selection */}
            <View>
              <TouchableOpacity
                style={styles.option}
                onPress={() => setIsCategoryVisible(!isCategoryVisible)}
              >
                <IconSymbol name="tag" size={20} color="#8E8E93" />
                <View style={styles.categoryPreview}>
                  <Text style={styles.optionText}>Category</Text>
                  {selectedCategory && (
                    <View style={[styles.selectedCategoryBadge, { backgroundColor: selectedCategory.color + '20' }]}>
                      <Text style={[styles.selectedCategoryText, { color: selectedCategory.color }]}>
                        {selectedCategory.name}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {isCategoryVisible && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoryList}
                  contentContainerStyle={styles.categoryListContent}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        category === cat.id && { backgroundColor: cat.color }
                      ]}
                      onPress={() => {
                        setCategory(cat.id);
                        setIsCategoryVisible(false);
                      }}
                    >
                      <IconSymbol
                        name={cat.icon as any}
                        size={16}
                        color={category === cat.id ? '#FFF' : cat.color}
                      />
                      <Text style={[
                        styles.categoryChipText,
                        category === cat.id && { color: '#FFF' }
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[styles.createButton, !title.trim() && styles.createButtonDisabled]}
              onPress={handleCreate}
              disabled={!title.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 18,
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 6,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  datePickerWeb: {
    flex: 1,
    height: 24,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  noteInput: {
    fontSize: 16,
    color: '#000',
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  categoryPreview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  selectedCategoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryList: {
    marginTop: 12,
    marginBottom: 12,
  },
  categoryListContent: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  createButton: {
    backgroundColor: '#5B9EF8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
    shadowColor: '#5B9EF8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  createButtonDisabled: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
  },
});
