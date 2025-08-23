import { Tabs } from 'expo-router';
import { Home, MessageCircle, User } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthGuard from '@/components/AuthGuard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <AuthGuard>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1DBF73',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingTop: isSmallScreen ? 6 : 8,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : (isSmallScreen ? 6 : 8),
          height: Platform.OS === 'ios' ? (isSmallScreen ? 70 : 80) + insets.bottom : (isSmallScreen ? 60 : 70),
          minHeight: 60,
        },
        tabBarLabelStyle: {
          fontSize: isSmallScreen ? 10 : (isTablet ? 14 : 12),
          fontWeight: '600',
          marginTop: isSmallScreen ? 2 : 4,
        },
        tabBarIconStyle: {
          marginTop: isSmallScreen ? 2 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={isSmallScreen ? 18 : (isTablet ? 26 : size)} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={isSmallScreen ? 18 : (isTablet ? 26 : size)} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={isSmallScreen ? 18 : (isTablet ? 26 : size)} />,
        }}
      />
      </Tabs>
    </AuthGuard>
  );
}