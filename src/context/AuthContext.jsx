import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authService, userService } from '../services/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        setSession(session);
        
        if (session?.user) {
          const userProfile = await userService.getUserById(session.user.id);
          setUser(userProfile);
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (session?.user) {
        try {
          const userProfile = await userService.getUserById(session.user.id);
          setUser(userProfile);
        } catch (err) {
          console.error('Error loading user profile:', err);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.signIn(email, password);
      const userProfile = await userService.getUserById(data.user.id);
      setUser(userProfile);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login gagal' };
    }
  };

  const register = async (email, password, name) => {
    try {
      await authService.signUp(email, password, { name });
      return { success: true };
    } catch (err) {
      console.error('Register error:', err);
      return { success: false, error: err.message || 'Registrasi gagal' };
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const isAdmin = user?.role === 'admin';

  const value = { 
    user, 
    session, 
    login, 
    logout, 
    register, 
    updateUser, 
    loading, 
    isAuthenticated: !!session,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
