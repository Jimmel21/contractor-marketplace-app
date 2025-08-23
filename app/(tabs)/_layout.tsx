import { Tabs } from 'expo-router';
import { Home, MessageCircle, User } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthGuard from '@/components/AuthGuard';
import { useTheme } from '@/hooks/theme-store';
import { SPACING, TYPOGRAPHY, SCREEN_SIZES, SHADOWS } from '@/constants/design-system';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0,
            paddingTop: SPACING.sm,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom + SPACING.sm : SPACING.sm,
            height: Platform.OS === 'ios' 
              ? (SCREEN_SIZES.isSmall ? 70 : 80) + insets.bottom 
              : (SCREEN_SIZES.isSmall ? 60 : 70),
            minHeight: 60,
            ...SHADOWS.lg,
          },
          tabBarLabelStyle: {
            ...TYPOGRAPHY.small,
            fontWeight: '600',
            marginTop: SPACING.xs,
          },
          tabBarIconStyle: {
            marginTop: SPACING.xs,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Home 
                color={color} 
                size={SCREEN_SIZES.isSmall ? 18 : SCREEN_SIZES.isTablet ? 26 : size} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, size }) => (
              <MessageCircle 
                color={color} 
                size={SCREEN_SIZES.isSmall ? 18 : SCREEN_SIZES.isTablet ? 26 : size} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <User 
                color={color} 
                size={SCREEN_SIZES.isSmall ? 18 : SCREEN_SIZES.isTablet ? 26 : size} 
              />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}