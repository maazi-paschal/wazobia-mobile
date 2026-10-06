import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onOpenCart, onOpenAuth }) => {
  const { totalItemCount, isSyncing } = useCart();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {/* User / Auth Icon Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onOpenAuth}
          activeOpacity={0.7}
          accessibilityLabel="User Account"
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.email ? user.email.charAt(0).toUpperCase() : '👤'}
            </Text>
            {user ? (
              <View style={styles.loggedInDot} />
            ) : null}
          </View>
        </TouchableOpacity>

        {/* Brand Logo & Subtitle */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>WAZOBIA</Text>
          <Text style={styles.brandSubtitle}>COUTURE & AFRO-LUXURY</Text>
        </View>

        {/* Cart Icon Button with Dynamic Badge Count */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onOpenCart}
          activeOpacity={0.7}
          accessibilityLabel="Shopping Cart"
        >
          <View style={styles.cartIconWrapper}>
            <Text style={styles.cartBagIcon}>🛍️</Text>
            {totalItemCount > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {totalItemCount > 99 ? '99+' : totalItemCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Cloud Sync Bar Indicator */}
      {isSyncing && (
        <View style={styles.syncBar}>
          <Text style={styles.syncText}>⚡ Syncing cart with cloud...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FCFBF9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 10 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE6E1',
  },
  headerContainer: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FCFBF9',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    color: '#FCFBF9',
    fontSize: 16,
    fontWeight: '700',
  },
  loggedInDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
    borderWidth: 1.5,
    borderColor: '#FCFBF9',
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif',
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 4,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C85A32',
    letterSpacing: 2,
    marginTop: 1,
  },
  cartIconWrapper: {
    position: 'relative',
    padding: 4,
  },
  cartBagIcon: {
    fontSize: 22,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#C85A32',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  syncBar: {
    backgroundColor: '#111111',
    paddingVertical: 3,
    alignItems: 'center',
  },
  syncText: {
    color: '#FCFBF9',
    fontSize: 11,
    fontWeight: '600',
  },
});
