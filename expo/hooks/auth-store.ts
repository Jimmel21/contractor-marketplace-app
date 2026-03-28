import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from '@/types/user';
import { LoginCredentials, RegisterData } from '@/types/auth';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Mock login - replace with actual API call
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: 'user_' + Date.now(),
          name: credentials.email.split('@')[0],
          email: credentials.email,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          type: 'client',
          availableRoles: ['client'], // Default login gets client only
          rating: 4.8,
          reviewCount: 0,
          joinedDate: new Date().toISOString(),
          bio: 'New user on the platform',
          location: 'Unknown'
        };

        await AsyncStorage.setItem('authToken', 'mock_token_' + Date.now());
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Mock registration - replace with actual API call
      let availableRoles: ('contractor' | 'client')[];
      let defaultType: 'contractor' | 'client';
      let bio: string;
      
      if (data.userType === 'both') {
        availableRoles = ['contractor', 'client'];
        defaultType = 'client'; // Default to client when both are available
        bio = 'Versatile user who can both hire contractors and provide services on the platform';
      } else {
        availableRoles = [data.userType];
        defaultType = data.userType;
        bio = `${data.userType === 'contractor' ? 'Professional contractor' : 'Looking for great services'} on the platform`;
      }
      
      const newUser: User = {
        id: 'user_' + Date.now(),
        name: data.name,
        email: data.email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        type: defaultType,
        availableRoles,
        rating: 0,
        reviewCount: 0,
        joinedDate: new Date().toISOString(),
        bio,
        location: 'Unknown'
      };

      await AsyncStorage.setItem('authToken', 'mock_token_' + Date.now());
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, [user]);

  return useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  }), [user, isLoading, isAuthenticated, login, register, logout, updateUser]);
});