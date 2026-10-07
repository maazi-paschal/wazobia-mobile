import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/catalog';

export const CartModal = ({ visible, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, isSyncing, clearCart } = useCart();
  const { user } = useAuth();

  const formattedSubtotal = formatPrice(subtotal);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Modal Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>YOUR SHOPPING BAG</Text>
            <Text style={styles.syncStatusText}>
              {user ? `Cloud Synced: ${user.email}` : 'Guest Cart (Sign in to sync across devices)'}
            </Text>
          </View>
          {cart.length > 0 ? (
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Syncing Indicator */}
        {isSyncing && (
          <View style={styles.syncBanner}>
            <Text style={styles.syncBannerText}>Syncing changes with Supabase...</Text>
          </View>
        )}

        {/* Cart Content */}
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛍️</Text>
            <Text style={styles.emptyTitle}>Your bag is currently empty</Text>
            <Text style={styles.emptySubtitle}>
              Explore our luxury fashion collection and discover your signature look.
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={onClose}>
              <Text style={styles.continueButtonText}>EXPLORE CATALOGUE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.itemList}>
              {cart.map((item, index) => (
                <View key={`${item.id}-${item.size}-${index}`} style={styles.cartItem}>
                  <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                  
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemSize}>SIZE: {item.size}</Text>
                    <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                    
                    {/* Stepper controls */}
                    <View style={styles.stepperRow}>
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => updateQuantity(item.id, item.size, -1)}
                      >
                        <Text style={styles.stepperText}>-</Text>
                      </TouchableOpacity>
                      
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      
                      <TouchableOpacity
                        style={styles.stepperButton}
                        onPress={() => updateQuantity(item.id, item.size, 1)}
                      >
                        <Text style={styles.stepperText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id, item.size)}
                  >
                    <Text style={styles.removeText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Pay on Delivery Notice Banner */}
              <View style={styles.payOnDeliveryBanner}>
                <View style={styles.podHeaderRow}>
                  <Text style={styles.podIcon}>🇳🇬</Text>
                  <Text style={styles.podTitle}>PAY ON DELIVERY AVAILABLE</Text>
                </View>
                <Text style={styles.podBody}>
                  Enjoy doorstep inspection and payment via Cash or Instant Bank Transfer upon delivery across major states in Nigeria & Ghana.
                </Text>
              </View>
            </ScrollView>

            {/* Footer / Subtotal & Checkout */}
            <View style={styles.footer}>
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>SUBTOTAL</Text>
                <Text style={styles.subtotalValue}>{formattedSubtotal}</Text>
              </View>

              <Text style={styles.shippingNotice}>
                Taxes calculated at checkout. Express Nationwide Shipping included.
              </Text>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => {
                  onClose();
                  onCheckout();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.checkoutButtonText}>PROCEED TO CHECKOUT</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBF9',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE6E1',
    backgroundColor: '#FCFBF9',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  titleWrapper: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#111111',
  },
  syncStatusText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C85A32',
  },
  syncBanner: {
    backgroundColor: '#C85A32',
    paddingVertical: 4,
    alignItems: 'center',
  },
  syncBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#FCFBF9',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  itemList: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAE6E1',
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#F3EFEA',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C85A32',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3EFEA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE6E1',
  },
  stepperText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  removeButton: {
    padding: 8,
  },
  removeText: {
    fontSize: 18,
  },
  payOnDeliveryBanner: {
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#F5C6B3',
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  podHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  podIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  podTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#C85A32',
    letterSpacing: 1,
  },
  podBody: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EAE6E1',
    backgroundColor: '#FFFFFF',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subtotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#666666',
    letterSpacing: 1,
  },
  subtotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#C85A32',
  },
  shippingNotice: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FCFBF9',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
