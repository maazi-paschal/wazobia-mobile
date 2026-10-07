import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// v2: amounts are USD (v1 held legacy Naira mock data)
const ORDER_HISTORY_KEY = '@wazobia_orders_v2';
const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders = await AsyncStorage.getItem(ORDER_HISTORY_KEY);
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      } catch (err) {
        console.log('Error loading orders:', err);
      }
    };
    loadOrders();
  }, []);

  const addOrder = async (order) => {
    const updated = [order, ...orders];
    setOrders(updated);
    try {
      await AsyncStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(updated));
    } catch (err) {
      console.log('Error saving order:', err);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
