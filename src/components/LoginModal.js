import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const LoginModal = ({ visible, onClose }) => {
  const { user, signInWithGoogle, signOut, googleLoading } = useAuth();
  const { cart, isSyncing } = useCart();

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (!error) onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {user ? 'ACCOUNT & SYNC' : 'SIGN IN'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {user ? (
              /* Logged In View */
              <View style={styles.loggedInBox}>
                <View style={styles.userBadgeCircle}>
                  <Text style={styles.userBadgeText}>
                    {user.email ? user.email.charAt(0).toUpperCase() : 'W'}
                  </Text>
                </View>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.userEmailText}>{user.email}</Text>

                <View style={styles.syncCard}>
                  <Text style={styles.syncCardTitle}>⚡ TWO-WAY CLOUD CART SYNC</Text>
                  <Text style={styles.syncCardDesc}>
                    Your shopping bag ({cart.length} item{cart.length === 1 ? '' : 's'}) is automatically backed up and synced in real-time to your Supabase account.
                  </Text>
                  {isSyncing && (
                    <Text style={styles.syncingBadge}>Sync in progress...</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={signOut}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signOutButtonText}>SIGN OUT</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Google Sign In */
              <View style={styles.formContainer}>
                <Text style={styles.heroTitle}>Welcome to Wazobia</Text>
                <Text style={styles.heroSubtitle}>
                  Sign in to seamlessly sync your cart, save preferences, and access exclusive Afro-luxury releases.
                </Text>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleGoogle}
                  disabled={googleLoading}
                  activeOpacity={0.85}
                >
                  {googleLoading ? (
                    <ActivityIndicator color="#FCFBF9" />
                  ) : (
                    <Text style={styles.submitButtonText}>CONTINUE WITH GOOGLE</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#111111',
  },
  content: {
    padding: 24,
  },
  loggedInBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userBadgeCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#C85A32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 4,
  },
  userEmailText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
  },
  syncCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EAE6E1',
    marginBottom: 24,
  },
  syncCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#C85A32',
    letterSpacing: 1,
    marginBottom: 8,
  },
  syncCardDesc: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 20,
  },
  syncingBadge: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  signOutButton: {
    width: '100%',
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FCFBF9',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  formContainer: {
    paddingVertical: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 24,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F3EFEA',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777777',
    letterSpacing: 1,
  },
  modeTabTextActive: {
    color: '#111111',
    fontWeight: '900',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#444444',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE6E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111111',
  },
  submitButton: {
    backgroundColor: '#111111',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FCFBF9',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAE6E1',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 10,
    fontWeight: '700',
    color: '#999999',
    letterSpacing: 1,
  },
  demoButton: {
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: '#C85A32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#C85A32',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
