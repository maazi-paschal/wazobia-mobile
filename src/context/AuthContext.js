import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please provide both email and password.');
      return { error: { message: 'Missing email or password' } };
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign In Failed', error.message);
    }
    return { data, error };
  };

  const signUp = async (email, password) => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please provide both email and password.');
      return { error: { message: 'Missing email or password' } };
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Success', 'Account created! If email confirmation is enabled, check your inbox.');
    }
    return { data, error };
  };

  // Demo Sign-In feature for quick testing without backend email verification
  const demoSignIn = (email = 'fashionista@wazobia.shop') => {
    const demoUser = {
      id: 'demo-user-123',
      email: email,
      user_metadata: { full_name: 'Wazobia Member' }
    };
    setUser(demoUser);
    setSession({ user: demoUser });
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        demoSignIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
