import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { normalizeProduct } from '../utils/catalog';

const ProductsContext = createContext();

// Fetches live products from Supabase once and shares them across Shop & Search.
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: products, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts((products || []).map(normalizeProduct));
    } catch (err) {
      console.log('Supabase products fetch error:', err?.message || err);
      setError(err?.message || 'Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductsContext.Provider value={{ products, loading, error, refresh: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
