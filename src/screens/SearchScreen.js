import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { ProductFilters } from '../components/ProductFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useProducts } from '../context/ProductsContext';
import { filterAndSortProducts } from '../utils/catalog';

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [size, setSize] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, loading, error, refresh } = useProducts();

  // Filter & Sort Logic
  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, { category, size, sortBy, query }),
    [products, category, size, sortBy, query]
  );

  const resetAll = () => {
    setQuery('');
    setCategory('All');
    setSize('');
    setSortBy('featured');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfbf9" />

      {/* Screen Header */}
      <ScreenHeader title="Search & Filter" subtitle="Find your next signature piece" />

      {/* Search Input Box */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tees, jackets, shirts..."
          placeholderTextColor="#999999"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category pills + Size / Sort dropdowns */}
      <ProductFilters
        category={category}
        onCategoryChange={setCategory}
        size={size}
        onSizeChange={setSize}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={loading ? undefined : filteredProducts.length}
        onReset={resetAll}
      />

      {/* 2-Column Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.gridColumnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <ProductCard product={item} onPressProduct={(prod) => setSelectedProduct(prod)} />
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator color="#c85a32" size="large" />
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Couldn't load products</Text>
              <Text style={styles.emptySubtitle}>{error}</Text>
              <TouchableOpacity style={styles.resetBtn} onPress={refresh}>
                <Text style={styles.resetBtnText}>TRY AGAIN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No matching items found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search terms or filters.
              </Text>
              <TouchableOpacity style={styles.resetBtn} onPress={resetAll}>
                <Text style={styles.resetBtnText}>RESET SEARCH</Text>
              </TouchableOpacity>
            </View>
          )
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
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
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
