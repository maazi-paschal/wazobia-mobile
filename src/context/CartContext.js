import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';

const LOCAL_CART_KEY = '@wazobia_cart_v1';
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial cart from AsyncStorage for guest / offline fallback
  useEffect(() => {
    const loadLocalCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(LOCAL_CART_KEY);
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (err) {
        console.log('Error loading local cart:', err);
      }
    };
    loadLocalCart();
  }, []);

  // Synchronize cart when user logs in
  useEffect(() => {
    if (!user || !user.email) return;

    const fetchCloudCart = async () => {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase
          .from('user_carts')
          .select('items')
          .eq('user_email', user.email)
          .maybeSingle();

        if (error) {
          console.log('Supabase fetch cart notice:', error.message);
        } else if (data && Array.isArray(data.items)) {
          // Cloud cart exists
          if (data.items.length > 0) {
            setCart(data.items);
            await AsyncStorage.setItem(LOCAL_CART_KEY, JSON.stringify(data.items));
            showToast('Cart synchronized from cloud');
          } else if (cart.length > 0) {
            // Push existing local items to cloud
            await syncToCloud(cart, user.email);
          }
        } else if (cart.length > 0) {
          // No cloud cart row yet, upload existing local cart
          await syncToCloud(cart, user.email);
        }
      } catch (err) {
        console.log('Cloud cart fetch error:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchCloudCart();
  }, [user?.email]);

  // Helper to sync updated cart to Supabase user_carts table
  const syncToCloud = async (updatedCart, email = user?.email) => {
    if (!email) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('user_carts')
        .upsert({
          user_email: email,
          items: updatedCart,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.log('Supabase cart sync error:', error.message);
      }
    } catch (err) {
      console.log('Supabase cart sync exception:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Update state locally and trigger cloud sync if user is logged in
  const updateCartState = async (newCart) => {
    setCart(newCart);
    try {
      await AsyncStorage.setItem(LOCAL_CART_KEY, JSON.stringify(newCart));
    } catch (err) {
      console.log('AsyncStorage save error:', err);
    }
    if (user?.email) {
      await syncToCloud(newCart, user.email);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Add Item to Bag
  const addToCart = (product, selectedSize) => {
    const size = selectedSize || product.defaultSize || product.sizes?.[0] || 'M';
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.selectedSize === size
    );

    let updatedCart = [];
    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          formattedPrice: product.formattedPrice,
          image: product.image,
          category: product.category,
          selectedSize: size,
          quantity: 1,
        },
      ];
    }

    updateCartState(updatedCart);
    showToast(`Added ${product.title} (${size}) to bag`);
  };

  // Remove Item from Bag
  const removeFromCart = (id, selectedSize) => {
    const updatedCart = cart.filter(
      (item) => !(item.id === id && item.selectedSize === selectedSize)
    );
    updateCartState(updatedCart);
    showToast('Item removed from bag');
  };

  // Update Item Quantity
  const updateQuantity = (id, selectedSize, delta) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id && item.selectedSize === selectedSize) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    updateCartState(updatedCart);
  };

  // Clear Bag
  const clearCart = () => {
    updateCartState([]);
  };

  // Dynamic Badge Count (total item count)
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal Calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        isSyncing,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
