import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../supabase';

// Required so the auth popup can close and hand control back to the app
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  // Google OAuth via Supabase + Expo WebBrowser
  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      const redirectUrl = makeRedirectUri({ scheme: 'wazobia' });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (res.type === 'success' && res.url) {
          const urlParts = res.url.split('#')[1] || res.url.split('?')[1];
          if (urlParts) {
            const params = Object.fromEntries(new URLSearchParams(urlParts));
            if (params.access_token && params.refresh_token) {
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: params.access_token,
                refresh_token: params.refresh_token,
              });
              if (sessionError) throw sessionError;
            } else if (params.error_description || params.error) {
              throw new Error(params.error_description || params.error);
            }
          }
        }
      }
      return { error: null };
    } catch (err) {
      console.log('Google sign-in error:', err?.message || err);
      Alert.alert('Google Sign-In Failed', err?.message || 'Please try again.');
      return { error: err };
    } finally {
      setGoogleLoading(false);
    }
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
        googleLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
