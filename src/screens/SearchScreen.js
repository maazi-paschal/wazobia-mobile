import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high'
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.tagline.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfbf9" />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXPLORE & SEARCH</Text>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Agbada, Silk, Shoes, Rings..."
          placeholderTextColor="#999999"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills */}
      <View style={styles.categoriesRow}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Sort Filter Selector */}
      <View style={styles.sortBar}>
        <Text style={styles.resultsCount}>
          {filteredProducts.length} Piece{filteredProducts.length === 1 ? '' : 's'} Found
        </Text>
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'default' && styles.sortBtnActive]}
            onPress={() => setSortBy('default')}
          >
            <Text style={[styles.sortText, sortBy === 'default' && styles.sortTextActive]}>
              Featured
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'price-low' && styles.sortBtnActive]}
            onPress={() => setSortBy('price-low')}
          >
            <Text style={[styles.sortText, sortBy === 'price-low' && styles.sortTextActive]}>
              Price: ↗
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'price-high' && styles.sortBtnActive]}
            onPress={() => setSortBy('price-high')}
          >
            <Text style={[styles.sortText, sortBy === 'price-high' && styles.sortTextActive]}>
              Price: ↘
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2-Column Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridColumnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPressProduct={(prod) => setSelectedProduct(prod)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No matching items found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms or category filters.
            </Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setQuery('');
                setSelectedCategory('All');
                setSortBy('default');
              }}
            >
              <Text style={styles.resetBtnText}>RESET SEARCH</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        visible={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfbf9',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e6df',
    backgroundColor: '#fcfbf9',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#111111',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 14,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111111',
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 13,
    color: '#888888',
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginTop: 10,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  categoryChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  categoryChipTextActive: {
    color: '#fcfbf9',
    fontWeight: '700',
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.5,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 6,
  },
  sortBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  sortBtnActive: {
    backgroundColor: '#c85a32',
    borderColor: '#c85a32',
  },
  sortText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#555555',
  },
  sortTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 24,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 38,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  resetBtnText: {
    color: '#fcfbf9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
