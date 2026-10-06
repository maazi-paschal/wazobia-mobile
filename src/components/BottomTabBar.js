import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const TABS = {
  SHOP: 'Shop',
  SEARCH: 'Search',
  BAG: 'Bag',
  PROFILE: 'Profile',
};

export const BottomTabBar = ({ activeTab, onSelectTab }) => {
  const { totalItemCount } = useCart();
  const { user } = useAuth();

  const tabItems = [
    {
      id: TABS.SHOP,
      label: 'Shop',
      icon: '🏛️',
    },
    {
      id: TABS.SEARCH,
      label: 'Search',
      icon: '🔍',
    },
    {
      id: TABS.BAG,
      label: 'Bag',
      icon: '🛍️',
      badge: totalItemCount,
    },
    {
      id: TABS.PROFILE,
      label: user ? 'Profile' : 'Sign In',
      icon: user ? '👤' : '🔑',
      hasDot: !!user,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                  {tab.icon}
                </Text>

                {/* Dynamic Cart Badge Count */}
                {tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </Text>
                  </View>
                )}

                {/* User Logged In Indicator Dot */}
                {tab.hasDot && !tab.badge && (
                  <View style={styles.activeUserDot} />
                )}
              </View>

              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8e6df',
  },
  tabContainer: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 56 : 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 3,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#c85a32',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  activeUserDot: {
    position: 'absolute',
    bottom: -1,
    right: -2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2e7d32',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#888888',
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: '#c85a32',
    fontWeight: '800',
  },
});
