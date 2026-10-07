import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { ProductFilters } from '../components/ProductFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { filterAndSortProducts, getUserProfile } from '../utils/catalog';

export const ShopScreen = ({ onNavigateToSearch }) => {
  const [category, setCategory] = useState('All');
  const [size, setSize] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isSyncing } = useCart();
  const { user } = useAuth();
  const { products, loading, error, refresh } = useProducts();

  const greeting = user ? `Welcome, ${getUserProfile(user).firstName}` : 'Welcome, Guest';

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, { category, size, sortBy }),
    [products, category, size, sortBy]
  );

  const resetFilters = () => {
    setCategory('All');
    setSize('');
    setSortBy('featured');
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.stateBox}>
          <ActivityIndicator color="#c85a32" size="large" />
          <Text style={styles.stateText}>Loading the collection…</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.stateBox}>
          <Text style={styles.stateTitle}>Couldn't load products</Text>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.stateBtn} onPress={refresh}>
            <Text style={styles.stateBtnText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.stateBox}>
        <Text style={styles.stateTitle}>
          {products.length ? 'No pieces match your filters.' : 'No products are available yet.'}
        </Text>
        {products.length > 0 && (
          <TouchableOpacity style={styles.stateBtn} onPress={resetFilters}>
            <Text style={styles.stateBtnText}>RESET FILTERS</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfbf9" />

      {/* Brand Header */}
      <ScreenHeader
        brand
        title="WAZOBIA"
        subtitle={greeting}
        right={
          <TouchableOpacity
            style={styles.searchQuickBtn}
            onPress={onNavigateToSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.searchQuickIcon}>🔍</Text>
          </TouchableOpacity>
        }
      />

      {/* Cloud Sync Notification Bar */}
      {isSyncing && (
        <View style={styles.syncIndicator}>
          <Text style={styles.syncIndicatorText}>⚡ Syncing cart with cloud...</Text>
        </View>
      )}

      {/* Category pills + Size / Sort dropdowns */}
      <ProductFilters
        category={category}
        onCategoryChange={setCategory}
        size={size}
        onSizeChange={setSize}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={loading ? undefined : filteredProducts.length}
        onReset={resetFilters}
      />

      {/* 2-Column Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.gridColumnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading && products.length > 0}
            onRefresh={refresh}
            tintColor="#c85a32"
          />
        }
        renderItem={({ item }) => (
          <ProductCard product={item} onPressProduct={(prod) => setSelectedProduct(prod)} />
        )}
        ListEmptyComponent={renderEmpty}
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
  searchQuickBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchQuickIcon: {
    fontSize: 15,
  },
  syncIndicator: {
    backgroundColor: '#111111',
    paddingVertical: 3,
    alignItems: 'center',
  },
  syncIndicatorText: {
    color: '#fcfbf9',
    fontSize: 10.5,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
  },
  stateBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  stateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 6,
  },
  stateText: {
    fontSize: 12.5,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  },
  stateBtn: {
    marginTop: 16,
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  stateBtnText: {
    color: '#fcfbf9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
