import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDER_HISTORY_KEY = '@wazobia_orders_v1';
const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      orderNumber: 'WZ-849201',
      date: 'Oct 04, 2026',
      totalAmount: 85000,
      paymentMethod: 'Pay on Delivery',
      status: 'Delivered',
      itemsCount: 1,
    }
  ]);

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
