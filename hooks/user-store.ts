import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { User } from '@/types/user';

const mockUser: User = {
  id: 'current',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  type: 'client',
  rating: 4.8,
  reviewCount: 23,
  joinedDate: '2023-06-15',
  bio: 'Passionate about connecting with talented professionals for various projects.',
  location: 'San Francisco, CA'
};

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(mockUser);
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const toggleUserType = () => {
    if (user) {
      updateUser({ type: user.type === 'contractor' ? 'client' : 'contractor' });
    }
  };

  return {
    user,
    isLoading,
    updateUser,
    toggleUserType
  };
});