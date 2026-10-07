import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { formatPrice, getUserProfile } from '../utils/catalog';

/* Multi-colour Google "G" built from text so no extra asset is needed. */
const GoogleMark = () => (
  <View style={styles.googleMark}>
    <Text style={styles.googleMarkText}>G</Text>
  </View>
);

export const ProfileScreen = () => {
  const { user, signInWithGoogle, signOut, loading, googleLoading } = useAuth();
  const { cart, isSyncing } = useCart();
  const { orders } = useOrders();

  const profile = user ? getUserProfile(user) : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfbf9" />

      {/* Screen Header */}
      <ScreenHeader
        title="My Profile"
        subtitle={user ? 'Account, cart sync & orders' : 'Sign in to sync your bag'}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading && !user ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#c85a32" size="large" />
          </View>
        ) : user ? (
          /* Logged In View */
          <View>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              {profile.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {(profile.fullName || 'W').charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.userNameText}>{profile.fullName}</Text>
              <Text style={styles.userEmailText}>{profile.email}</Text>
              <View style={styles.memberStatusBadge}>
                <Text style={styles.memberStatusText}>✦ WAZOBIA MEMBER</Text>
              </View>
            </View>

            {/* Cloud Sync Status Card */}
            <View style={styles.syncCard}>
              <View style={styles.syncHeaderRow}>
                <Text style={styles.syncIcon}>⚡</Text>
                <Text style={styles.syncCardTitle}>TWO-WAY CLOUD CART SYNC</Text>
              </View>
              <Text style={styles.syncCardDesc}>
                Your bag ({cart.length} item{cart.length === 1 ? '' : 's'}) is synced in real time
                between the Wazobia website and this app.
              </Text>
              <View style={styles.syncStatusRow}>
                <View style={styles.activeDot} />
                <Text style={styles.syncActiveText}>
                  {isSyncing ? 'Syncing with cloud...' : 'Real-Time Sync Active'}
                </Text>
              </View>
            </View>

            {/* Order History Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ORDER HISTORY</Text>
              <Text style={styles.orderCount}>
                {orders.length} Order{orders.length === 1 ? '' : 's'}
              </Text>
            </View>

            {orders.length === 0 ? (
              <View style={styles.emptyOrdersCard}>
                <Text style={styles.emptyOrderIcon}>📦</Text>
                <Text style={styles.emptyOrderText}>No previous orders recorded yet.</Text>
              </View>
            ) : (
              orders.map((order, idx) => (
                <View key={order.orderNumber || idx} style={styles.orderCard}>
                  <View style={styles.orderHeaderRow}>
                    <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>{order.status || 'Processing'}</Text>
                    </View>
                  </View>

                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Date:</Text>
                    <Text style={styles.orderDetailVal}>{order.date || 'Today'}</Text>
                  </View>

                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Payment:</Text>
                    <Text style={styles.orderDetailValHighlight}>
                      {order.paymentMethod || 'Pay on Delivery (POD)'}
                    </Text>
                  </View>

                  <View style={[styles.orderDetailRow, { marginTop: 4 }]}>
                    <Text style={styles.orderDetailLabel}>Total Amount:</Text>
                    <Text style={styles.orderTotalAmount}>{formatPrice(order.totalAmount)}</Text>
                  </View>
                </View>
              ))
            )}

            {/* Sign Out CTA */}
            <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.85}>
              <Text style={styles.signOutBtnText}>SIGN OUT</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Guest Sign In View */
          <View style={styles.authContainer}>
            <View style={styles.authHero}>
              <Text style={styles.authBrand}>WAZOBIA</Text>
              <View style={styles.authRule} />
              <Text style={styles.heroAuthTitle}>Join the House of Wazobia</Text>
              <Text style={styles.heroAuthSubtitle}>
                Sign in to sync your shopping bag between the website and app, track orders, and
                unlock member-only releases.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.googleBtn, googleLoading && { opacity: 0.7 }]}
              onPress={signInWithGoogle}
              disabled={googleLoading}
              activeOpacity={0.85}
            >
              {googleLoading ? (
                <ActivityIndicator color="#111111" />
              ) : (
                <>
                  <GoogleMark />
                  <Text style={styles.googleBtnText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.perksCard}>
              {[
                ['⚡', 'Two-way cart sync with wazobia-shop'],
                ['📦', 'Order history & delivery tracking'],
                ['✦', 'Early access to new drops'],
              ].map(([icon, text]) => (
                <View key={text} style={styles.perkRow}>
                  <Text style={styles.perkIcon}>{icon}</Text>
                  <Text style={styles.perkText}>{text}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.legalText}>
              By continuing you agree to Wazobia's Terms of Service and Privacy Policy.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfbf9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingBox: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginBottom: 16,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#f1e6dc',
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fcfbf9',
    fontSize: 32,
    fontWeight: '900',
  },
  userNameText: {
    fontSize: 19,
    fontWeight: '900',
    color: '#111111',
    textAlign: 'center',
  },
  userEmailText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 3,
    marginBottom: 12,
  },
  memberStatusBadge: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#c85a32',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  memberStatusText: {
    color: '#c85a32',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  syncCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginBottom: 20,
  },
  syncHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  syncIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  syncCardTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#c85a32',
    letterSpacing: 1,
  },
  syncCardDesc: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 10,
  },
  syncStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e7d32',
    marginRight: 6,
  },
  syncActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2e7d32',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 1.5,
  },
  orderCount: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '600',
  },
  emptyOrdersCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginBottom: 20,
  },
  emptyOrderIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  emptyOrderText: {
    fontSize: 12,
    color: '#777777',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginBottom: 10,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3efea',
    paddingBottom: 6,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111111',
  },
  statusPill: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2e7d32',
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderDetailLabel: {
    fontSize: 11.5,
    color: '#777777',
  },
  orderDetailVal: {
    fontSize: 11.5,
    color: '#111111',
    fontWeight: '600',
  },
  orderDetailValHighlight: {
    fontSize: 11.5,
    color: '#c85a32',
    fontWeight: '700',
  },
  orderTotalAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  signOutBtn: {
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  signOutBtnText: {
    color: '#fcfbf9',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  authContainer: {
    paddingVertical: 8,
  },
  authHero: {
    backgroundColor: '#111111',
    borderRadius: 18,
    paddingVertical: 30,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: 22,
  },
  authBrand: {
    color: '#fcfbf9',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 8,
  },
  authRule: {
    width: 36,
    height: 2,
    backgroundColor: '#c85a32',
    marginVertical: 14,
  },
  heroAuthTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fcfbf9',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroAuthSubtitle: {
    fontSize: 12.5,
    color: '#bdb7ad',
    lineHeight: 19,
    textAlign: 'center',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#111111',
    borderRadius: 30,
    paddingVertical: 15,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  googleMark: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleMarkText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.3,
  },
  perksCard: {
    marginTop: 22,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e6df',
    padding: 16,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  perkIcon: {
    width: 26,
    fontSize: 14,
    color: '#c85a32',
  },
  perkText: {
    fontSize: 12.5,
    color: '#333333',
    fontWeight: '600',
  },
  legalText: {
    marginTop: 18,
    fontSize: 10.5,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
  },
});
