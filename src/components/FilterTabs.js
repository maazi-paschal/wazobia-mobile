import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CATEGORIES } from '../data/products';

export const FilterTabs = ({ activeCategory, onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfbf9',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e6df',
  },
  scrollContent: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  activeTabButton: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#fcfbf9',
    fontWeight: '700',
  },
});
