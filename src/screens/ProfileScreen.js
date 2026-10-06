import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';

export const ProfileScreen = () => {
  const { user, signIn, signUp, demoSignIn, signOut, loading } = useAuth();
  const { cart, isSyncing } = useCart();
  const { orders } = useOrders();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleAuthSubmit = async () => {
    if (isRegisterMode) {
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  const handleDemoSignIn = () => {
    demoSignIn(email || 'patron@wazobia.shop');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcfbf9" />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {user ? 'MY ACCOUNT & ORDERS' : 'ACCOUNT & MEMBERSHIP'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {user ? (
            /* Logged In View */
            <View>
              {/* Profile Card */}
              <View style={styles.profileCard}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {user.email ? user.email.charAt(0).toUpperCase() : 'W'}
                  </Text>
                </View>
                <View style={styles.profileDetails}>
                  <Text style={styles.userNameText}>Wazobia Member</Text>
                  <Text style={styles.userEmailText}>{user.email}</Text>
                  <View style={styles.memberStatusBadge}>
                    <Text style={styles.memberStatusText}>VIP PATRON</Text>
                  </View>
                </View>
              </View>

              {/* Cloud Sync Status Card */}
              <View style={styles.syncCard}>
                <View style={styles.syncHeaderRow}>
                  <Text style={styles.syncIcon}>⚡</Text>
                  <Text style={styles.syncCardTitle}>TWO-WAY CLOUD CART SYNC</Text>
                </View>
                <Text style={styles.syncCardDesc}>
                  Your cart items ({cart.length} item{cart.length === 1 ? '' : 's'}) are automatically synced in real time across the Wazobia website and mobile application via Supabase <Text style={{ fontWeight: '700' }}>user_carts</Text>.
                </Text>
                <View style={styles.syncStatusRow}>
                  <View style={styles.activeDot} />
                  <Text style={styles.syncActiveText}>
                    {isSyncing ? 'Syncing with Supabase...' : 'Real-Time Sync Active'}
                  </Text>
                </View>
              </View>

              {/* Order History Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ORDER HISTORY</Text>
                <Text style={styles.orderCount}>{orders.length} Order{orders.length === 1 ? '' : 's'}</Text>
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
                      <Text style={styles.orderTotalAmount}>₦{order.totalAmount.toLocaleString()}</Text>
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
            /* Guest Sign In / Register View */
            <View style={styles.authContainer}>
              <Text style={styles.heroAuthTitle}>
                {isRegisterMode ? 'Create Wazobia Account' : 'Sign In to Your Account'}
              </Text>
              <Text style={styles.heroAuthSubtitle}>
                Sign in with your registered account credentials to automatically sync your shopping bag between devices and track order deliveries.
              </Text>

              {/* Mode Toggle Tabs */}
              <View style={styles.authTabs}>
                <TouchableOpacity
                  style={[styles.authTab, !isRegisterMode && styles.authTabActive]}
                  onPress={() => setIsRegisterMode(false)}
                >
                  <Text style={[styles.authTabText, !isRegisterMode && styles.authTabTextActive]}>
                    SIGN IN
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.authTab, isRegisterMode && styles.authTabActive]}
                  onPress={() => setIsRegisterMode(true)}
                >
                  <Text style={[styles.authTabText, isRegisterMode && styles.authTabTextActive]}>
                    REGISTER
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Inputs */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="patron@wazobia.shop"
                  placeholderTextColor="#999999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PASSWORD</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor="#999999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAuthSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fcfbf9" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    {isRegisterMode ? 'CREATE ACCOUNT' : 'SIGN IN & SYNC BAG'}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Quick Demo Test Option */}
              <View style={styles.orDivider}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR QUICK TEST</Text>
                <View style={styles.orLine} />
              </View>

              <TouchableOpacity
                style={styles.demoLoginBtn}
                onPress={handleDemoSignIn}
                activeOpacity={0.8}
              >
                <Text style={styles.demoLoginBtnText}>⚡ INSTANT DEMO LOGIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fcfbf9',
    fontSize: 22,
    fontWeight: '900',
  },
  profileDetails: {
    flex: 1,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  userEmailText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    marginBottom: 6,
  },
  memberStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#c85a32',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  memberStatusText: {
    color: '#c85a32',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
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
    paddingVertical: 10,
  },
  heroAuthTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 6,
  },
  heroAuthSubtitle: {
    fontSize: 12.5,
    color: '#666666',
    lineHeight: 19,
    marginBottom: 20,
  },
  authTabs: {
    flexDirection: 'row',
    backgroundColor: '#f3efea',
    borderRadius: 8,
    padding: 3,
    marginBottom: 20,
  },
  authTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 6,
  },
  authTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  authTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#777777',
    letterSpacing: 1,
  },
  authTabTextActive: {
    color: '#111111',
    fontWeight: '900',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#444444',
    letterSpacing: 1,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e6df',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: '#111111',
  },
  submitBtn: {
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#fcfbf9',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e8e6df',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 9.5,
    fontWeight: '700',
    color: '#999999',
    letterSpacing: 1,
  },
  demoLoginBtn: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#c85a32',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoLoginBtnText: {
    color: '#c85a32',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
