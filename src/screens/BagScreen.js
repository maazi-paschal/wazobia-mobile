import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const BagScreen = ({ onCheckout, onNavigateToShop, onNavigateToProfile }) => {
  const { cart, removeFromCart, updateQuantity, subtotal, isSyncing, clearCart } = useCart();
  const { user } = useAuth();

  const formattedSubtotal = `₦${subtotal.toLocaleString()}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfbf9" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>YOUR SHOPPING BAG</Text>
          <Text style={styles.syncStatusText}>
            {user ? `⚡ Synced with ${user.email}` : 'Guest Bag • Sign in to sync across devices'}
          </Text>
        </View>

        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cloud Sync Progress Banner */}
      {isSyncing && (
        <View style={styles.syncBanner}>
          <Text style={styles.syncBannerText}>⚡ Syncing cart with Supabase cloud...</Text>
        </View>
      )}

      {/* Cart Content */}
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛍️</Text>
          <Text style={styles.emptyTitle}>Your bag is currently empty</Text>
          <Text style={styles.emptySubtitle}>
            Explore our curated Afro-luxury collection and add your favorite pieces.
          </Text>
          <TouchableOpacity style={styles.continueBtn} onPress={onNavigateToShop} activeOpacity={0.85}>
            <Text style={styles.continueBtnText}>EXPLORE CATALOGUE</Text>
          </TouchableOpacity>
          {!user && (
            <TouchableOpacity style={styles.signInPromptBtn} onPress={onNavigateToProfile}>
              <Text style={styles.signInPromptText}>Have a saved cart? Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.mainWrapper}>
          <ScrollView contentContainerStyle={styles.itemList} showsVerticalScrollIndicator={false}>
            {cart.map((item, index) => (
              <View key={`${item.id}-${item.selectedSize}-${index}`} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />

                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemSize}>SIZE: {item.selectedSize}</Text>
                  <Text style={styles.itemPrice}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </Text>

                  {/* Quantity Stepper Controls */}
                  <View style={styles.stepperRow}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateQuantity(item.id, item.selectedSize, -1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.stepperBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityNum}>{item.quantity}</Text>

                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateQuantity(item.id, item.selectedSize, 1)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remove Item */}
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeFromCart(item.id, item.selectedSize)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Pay on Delivery Notice Banner */}
            <View style={styles.podBanner}>
              <View style={styles.podHeader}>
                <Text style={styles.podFlag}>🇳🇬</Text>
                <Text style={styles.podTitle}>PAY ON DELIVERY AVAILABLE</Text>
              </View>
              <Text style={styles.podBody}>
                Inspect your items before making payment via Cash or Bank Transfer upon doorstep delivery across Nigeria & Ghana.
              </Text>
            </View>
          </ScrollView>

          {/* Bottom Checkout Summary Card */}
          <View style={styles.summaryFooter}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>SUBTOTAL</Text>
              <Text style={styles.subtotalAmount}>{formattedSubtotal}</Text>
            </View>

            <Text style={styles.deliveryNote}>
              Complimentary luxury packaging & express doorstep delivery.
            </Text>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={onCheckout}
              activeOpacity={0.88}
            >
              <Text style={styles.checkoutBtnText}>PROCEED TO CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
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
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#111111',
  },
  syncStatusText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c85a32',
  },
  syncBanner: {
    backgroundColor: '#c85a32',
    paddingVertical: 3,
    alignItems: 'center',
  },
  syncBannerText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontWeight: '700',
  },
  mainWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  continueBtn: {
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueBtnText: {
    color: '#fcfbf9',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  signInPromptBtn: {
    marginTop: 16,
  },
  signInPromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c85a32',
  },
  itemList: {
    padding: 14,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e8e6df',
    alignItems: 'center',
  },
  itemImage: {
    width: 65,
    height: 85,
    borderRadius: 6,
    backgroundColor: '#fcfbf9',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 3,
  },
  itemSize: {
    fontSize: 11,
    fontWeight: '700',
    color: '#c85a32',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fcfbf9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  stepperBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  quantityNum: {
    marginHorizontal: 10,
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
  },
  removeBtn: {
    padding: 6,
  },
  removeIcon: {
    fontSize: 16,
  },
  podBanner: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  podHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  podFlag: {
    fontSize: 16,
    marginRight: 6,
  },
  podTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#c85a32',
    letterSpacing: 1,
  },
  podBody: {
    fontSize: 11.5,
    color: '#555555',
    lineHeight: 17,
  },
  summaryFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8e6df',
    backgroundColor: '#ffffff',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666666',
    letterSpacing: 1,
  },
  subtotalAmount: {
    fontSize: 19,
    fontWeight: '900',
    color: '#c85a32',
  },
  deliveryNote: {
    fontSize: 10.5,
    color: '#888888',
    marginBottom: 12,
  },
  checkoutBtn: {
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#fcfbf9',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
