// app/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';

// Define your API base URL - update this with your actual backend URL
const API_URL = 'http://your-backend-url/api'; // Replace with your actual URL

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for user and authentication
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, message?: string}>;
  register: (userData: RegisterData) => Promise<{success: boolean, message?: string}>;
  logout: () => void;
  continueAsGuest: () => void;
  isLoggedIn: () => boolean;
  checkAccess: (requiredAuth?: boolean) => boolean;
};

type RegisterData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

// Create the context
export const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  userToken: null,
  user: null,
  isGuest: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  continueAsGuest: () => {},
  isLoggedIn: () => false,
  checkAccess: () => false,
});

// Create the provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  // Check for existing token on load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        const guestMode = await AsyncStorage.getItem('guestMode');
        
        if (token && userData) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUserToken(token);
          setUser(JSON.parse(userData));
        } else if (guestMode === 'true') {
          setIsGuest(true);
        }
      } catch (error) {
        console.log('Failed to load auth token', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadToken();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      // The response format matches your backend controller
      const { token, user } = response.data;
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.removeItem('guestMode');
      
      setUserToken(token);
      setUser(user);
      setIsGuest(false);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', userData);
      
      // The response format matches your backend controller
      const { token, user } = response.data;
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      await AsyncStorage.removeItem('guestMode');
      
      setUserToken(token);
      setUser(user);
      setIsGuest(false);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('guestMode');
      
      delete api.defaults.headers.common['Authorization'];
      
      setUserToken(null);
      setUser(null);
      setIsGuest(false);
      
      // Navigate to home
      router.replace('/');
    } catch (error) {
      console.log('Logout error', error);
    }
  };

  // Continue as guest function
  const continueAsGuest = async () => {
    try {
      setIsGuest(true);
      await AsyncStorage.setItem('guestMode', 'true');
    } catch (error) {
      console.log('Guest mode error', error);
    }
  };

  // Check if logged in
  const isLoggedIn = () => {
    return !!userToken;
  };

  // Check access to features
  const checkAccess = (requiredAuth = true) => {
    if (!requiredAuth) {
      return true; // Feature available to everyone
    }
    return isLoggedIn(); // Only logged-in users can access
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        user,
        isGuest,
        login,
        register,
        logout,
        continueAsGuest,
        isLoggedIn,
        checkAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a shortcut for the API with auth token
export { api };