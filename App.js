import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { OrderProvider, useOrders } from './src/context/OrderContext';
import { ProductsProvider } from './src/context/ProductsContext';

// Navigation & Screens
import { BottomTabBar, TABS } from './src/components/BottomTabBar';
import { ShopScreen } from './src/screens/ShopScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { BagScreen } from './src/screens/BagScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

// Modals
import { CheckoutSuccessModal } from './src/components/CheckoutSuccessModal';

const NavigationContainer = () => {
  const [activeTab, setActiveTab] = useState(TABS.SHOP);
  const { subtotal, clearCart, toastMessage, cart } = useCart();
  const { addOrder } = useOrders();

  // Checkout modal state
  const [isCheckoutSuccessVisible, setIsCheckoutSuccessVisible] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState({ orderNumber: '', totalAmount: 0 });

  const handleCheckout = () => {
    const randomOrderNum = `WZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderNumber: randomOrderNum,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      totalAmount: subtotal,
      paymentMethod: 'Pay on Delivery (POD)',
      status: 'Processing',
      itemsCount: cart.length,
    };

    addOrder(newOrder);
    setLastOrderDetails({
      orderNumber: randomOrderNum,
      totalAmount: subtotal,
    });
    clearCart();
    setIsCheckoutSuccessVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="dark" />

      {/* Screen Container */}
      <View style={styles.screenWrapper}>
        {activeTab === TABS.SHOP && (
          <ShopScreen onNavigateToSearch={() => setActiveTab(TABS.SEARCH)} />
        )}
        {activeTab === TABS.SEARCH && <SearchScreen />}
        {activeTab === TABS.BAG && (
          <BagScreen
            onCheckout={handleCheckout}
            onNavigateToShop={() => setActiveTab(TABS.SHOP)}
            onNavigateToProfile={() => setActiveTab(TABS.PROFILE)}
          />
        )}
        {activeTab === TABS.PROFILE && <ProfileScreen />}
      </View>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Checkout Success Modal */}
      <CheckoutSuccessModal
        visible={isCheckoutSuccessVisible}
        onClose={() => {
          setIsCheckoutSuccessVisible(false);
          setActiveTab(TABS.PROFILE);
        }}
        orderNumber={lastOrderDetails.orderNumber}
        totalAmount={lastOrderDetails.totalAmount}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <OrderProvider>
            <NavigationContainer />
          </OrderProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfbf9',
  },
  screenWrapper: {
    flex: 1,
  },
});
