import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { formatPrice, defaultSizeFor } from '../utils/catalog';

const { width } = Dimensions.get('window');
// 2-column calculation with balanced gutters
const CARD_WIDTH = (width - 40) / 2;

export const ProductCard = ({ product, onPressProduct }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(defaultSizeFor(product.sizes));

  const handleAdd = () => {
    addToCart(product, selectedSize);
  };

  return (
    <View style={styles.cardContainer}>
      {/* 3:4 Portrait Image Wrapper */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onPressProduct(product)}
        style={styles.imageWrapper}
      >
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.imageFallbackText}>WAZOBIA</Text>
          </View>
        )}
        {!!product.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Product Info */}
      <View style={styles.infoWrapper}>
        <TouchableOpacity onPress={() => onPressProduct(product)} activeOpacity={0.7}>
          <Text style={styles.title} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
        </TouchableOpacity>

        {/* Interactive Size Selector */}
        <View style={styles.sizeSection}>
          <Text style={styles.sizeLabel}>SIZE:</Text>
          <View style={styles.sizesRow}>
            {product.sizes.map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <TouchableOpacity
                  key={sz}
                  style={[styles.sizeChip, isSelected && styles.sizeChipActive]}
                  onPress={() => setSelectedSize(sz)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sizeChipText, isSelected && styles.sizeChipTextActive]}>
                    {sz}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Add to Bag CTA Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>ADD TO BAG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e6df',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: CARD_WIDTH * (4 / 3), // 3:4 portrait aspect ratio
    backgroundColor: '#fcfbf9',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    flex: 1,
    backgroundColor: '#f1e6dc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFallbackText: {
    color: '#c85a32',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 4,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(17, 17, 17, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryText: {
    color: '#fcfbf9',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  infoWrapper: {
    padding: 10,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#c85a32',
    marginBottom: 8,
  },
  sizeSection: {
    marginBottom: 10,
  },
  sizeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  sizeChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#fcfbf9',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  sizeChipActive: {
    backgroundColor: '#c85a32',
    borderColor: '#c85a32',
  },
  sizeChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333333',
  },
  sizeChipTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: '#111111',
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fcfbf9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
