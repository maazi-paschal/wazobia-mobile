import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

export const ShopScreen = ({ onNavigateToSearch }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isSyncing } = useCart();

  const filteredProducts = PRODUCTS.filter((product) => {
    if (activeCategory === 'All') return true;
    return product.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfbf9" />

      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View>
          <Text style={styles.brandTitle}>WAZOBIA</Text>
          <Text style={styles.brandSubtitle}>COUTURE & AFRO-LUXURY</Text>
        </View>

        <TouchableOpacity
          style={styles.searchQuickBtn}
          onPress={onNavigateToSearch}
          activeOpacity={0.7}
        >
          <Text style={styles.searchQuickIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Cloud Sync Notification Bar */}
      {isSyncing && (
        <View style={styles.syncIndicator}>
          <Text style={styles.syncIndicatorText}>⚡ Syncing cart with cloud...</Text>
        </View>
      )}

      {/* Category Tabs */}
      <FilterTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

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
        ListHeaderComponent={
          <View style={styles.heroBanner}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>NEW SEASON 2026</Text>
            </View>
            <Text style={styles.heroTitle}>The Heritage Capsule</Text>
            <Text style={styles.heroDescription}>
              Hand-dyed Adire, architectural Agbada drapes, and artisanal bronze accents handcrafted across West Africa.
            </Text>
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
  brandHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e6df',
    backgroundColor: '#fcfbf9',
    paddingTop: Platform.OS === 'android' ? 6 : 0,
  },
  brandTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 4,
  },
  brandSubtitle: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#c85a32',
    letterSpacing: 2,
    marginTop: 1,
  },
  searchQuickBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  heroBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#c85a32',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 24,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
  },
});
