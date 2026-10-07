import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { formatPrice, defaultSizeFor } from '../utils/catalog';

const { width } = Dimensions.get('window');

export const ProductDetailModal = ({ product, visible, onClose }) => {
  if (!product) return null;
  return (
    <ProductDetailContent key={product.id} product={product} visible={visible} onClose={onClose} />
  );
};

const ProductDetailContent = ({ product, visible, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(defaultSizeFor(product.sizes));

  const handleAdd = () => {
    addToCart(product, selectedSize);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{(product.category || 'WAZOBIA').toUpperCase()}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Hero Image */}
          <View style={styles.imageContainer}>
            {product.image_url ? (
              <Image
                source={{ uri: product.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imageFallback}>
                <Text style={styles.imageFallbackText}>WAZOBIA</Text>
              </View>
            )}
          </View>

          {/* Product Details */}
          <View style={styles.detailsBox}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>

            <View style={styles.divider} />

            <Text style={styles.sectionHeading}>DESCRIPTION</Text>
            <Text style={styles.description}>
              {product.description || 'No description available.'}
            </Text>

            <View style={styles.divider} />

            {/* Size Selector */}
            <Text style={styles.sectionHeading}>SELECT YOUR SIZE</Text>
            <View style={styles.sizeRow}>
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <TouchableOpacity
                    key={size}
                    style={[styles.sizeButton, isSelected && styles.sizeButtonActive]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[styles.sizeText, isSelected && styles.sizeTextActive]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Care / Logistics note */}
            <View style={styles.guaranteeBox}>
              <Text style={styles.guaranteeText}>🌿 100% Authentic West African Craftsmanship</Text>
              <Text style={styles.guaranteeSub}>Complimentary luxury dustbag included</Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Footer CTA */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
            <Text style={styles.addButtonText}>ADD TO BAG — {formatPrice(product.price)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfbf9',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e6df',
    backgroundColor: '#fcfbf9',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  headerTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#111111',
  },
  content: {
    paddingBottom: 30,
  },
  imageContainer: {
    width: width,
    height: width * (4 / 3),
    backgroundColor: '#fcfbf9',
  },
  image: {
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
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 6,
  },
  detailsBox: {
    padding: 18,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -16,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#c85a32',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555555',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e6df',
    marginVertical: 14,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  description: {
    fontSize: 12.5,
    color: '#444444',
    lineHeight: 20,
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  sizeButton: {
    minWidth: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#fcfbf9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  sizeButtonActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  sizeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
  },
  sizeTextActive: {
    color: '#fcfbf9',
  },
  guaranteeBox: {
    backgroundColor: '#fcfbf9',
    padding: 12,
    borderRadius: 8,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  guaranteeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 2,
  },
  guaranteeSub: {
    fontSize: 10.5,
    color: '#666666',
  },
  footer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#e8e6df',
    backgroundColor: '#ffffff',
  },
  addButton: {
    backgroundColor: '#111111',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fcfbf9',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
