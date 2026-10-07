import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import { useAuth } from './AuthContext';
import { defaultSizeFor, normalizeCartItem } from '../utils/catalog';

// v2: v1 could contain legacy mock items priced in Naira
const LOCAL_CART_KEY = '@wazobia_cart_v2';
const CartContext = createContext();

// Old hardcoded mock products used ids like "wazobia-001" — never valid DB ids
const isLegacyMockItem = (i) => /^wazobia-\d+$/.test(String(i?.id));
const sanitizeCart = (items) =>
  (Array.isArray(items) ? items : []).filter((i) => i && !isLegacyMockItem(i)).map(normalizeCartItem);

/* Cart items share the web store's shape so user_carts syncs both ways:
 * { id, name, price, image_url, size, quantity } */
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const cartRef = useRef(cart);
  cartRef.current = cart;

  // Load initial cart from AsyncStorage for guest / offline fallback
  useEffect(() => {
    const loadLocalCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem(LOCAL_CART_KEY);
        if (savedCart) {
          setCart(sanitizeCart(JSON.parse(savedCart)));
        }
      } catch (err) {
        console.log('Error loading local cart:', err);
      }
    };
    loadLocalCart();
  }, []);

  // Fetch cloud cart when user signs in
  useEffect(() => {
    if (!user?.email) return;

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
        } else if (sanitizeCart(data?.items).length > 0) {
          const cloudCart = sanitizeCart(data.items);
          setCart(cloudCart);
          await AsyncStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cloudCart));
          showToast('Cart synchronized from cloud');
        } else if (cartRef.current.length > 0) {
          // Cloud cart empty/missing — upload the existing guest cart
          await syncToCloud(cartRef.current, user.email);
        }
      } catch (err) {
        console.log('Cloud cart fetch error:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    fetchCloudCart();
  }, [user?.email]);

  // Upsert updated cart to Supabase user_carts table
  const syncToCloud = async (updatedCart, email = user?.email) => {
    if (!email) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('user_carts').upsert({
        user_email: email,
        items: updatedCart,
        updated_at: new Date().toISOString(),
      });
      if (error) console.log('Supabase cart sync error:', error.message);
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
    const size = selectedSize || defaultSizeFor(product.sizes || []);
    const current = cartRef.current;
    const exists = current.some((i) => i.id === product.id && i.size === size);

    const updatedCart = exists
      ? current.map((i) =>
          i.id === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i
        )
      : [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            size,
            quantity: 1,
          },
        ];

    updateCartState(updatedCart);
    showToast(`${product.name} (${size}) added to your bag`);
  };

  // Remove Item from Bag
  const removeFromCart = (id, size) => {
    const updatedCart = cartRef.current.filter((i) => !(i.id === id && i.size === size));
    updateCartState(updatedCart);
    showToast('Item removed from bag');
  };

  // Update Item Quantity
  const updateQuantity = (id, size, delta) => {
    const updatedCart = cartRef.current
      .map((i) => {
        if (i.id === id && i.size === size) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter(Boolean);

    updateCartState(updatedCart);
  };

  // Clear Bag
  const clearCart = () => {
    updateCartState([]);
  };

  // Dynamic Badge Count (total item count)
  const totalItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Subtotal Calculation (USD)
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
