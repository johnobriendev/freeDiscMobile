import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';

// Define your API base URL
const API_URL = 'https://your-disc-golf-api.com/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define the shape of your context
type AuthContextType = {
  isLoading: boolean;
  userToken: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<{success: boolean, message?: string}>;
  register: (userData: any) => Promise<{success: boolean, message?: string}>;
  logout: () => void;
};

// Create the context
export const AuthContext = createContext<AuthContextType>({
  isLoading: false,
  userToken: null,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

// Create the provider component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // Check for existing token on load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        
        if (token && userData) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUserToken(token);
          setUser(JSON.parse(userData));
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
      
      const { token, user } = response.data;
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      setUserToken(token);
      setUser(user);
      
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
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', userData);
      
      const { token, user } = response.data;
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      setUserToken(token);
      setUser(user);
      
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
      
      delete api.defaults.headers.common['Authorization'];
      
      setUserToken(null);
      setUser(null);
      
      // Navigate to login
      router.replace('/login');
    } catch (error) {
      console.log('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the API instance for use in other files
export { api };