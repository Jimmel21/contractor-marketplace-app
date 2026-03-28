import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    primaryLight: string;
    border: string;
    borderLight: string;
    success: string;
    error: string;
    warning: string;
    overlay: string;
    shadow: string;
  };
}

const lightTheme: Theme['colors'] = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: '#1DBF73',
  primaryLight: '#E8F5E8',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
};

const darkTheme: Theme['colors'] = {
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  primary: '#1DBF73',
  primaryLight: '#0F2A1A',
  border: '#4B5563',
  borderLight: '#374151',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: '#000000',
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const theme: Theme = useMemo(() => ({
    mode: themeMode,
    isDark,
    colors: isDark ? darkTheme : lightTheme,
  }), [themeMode, isDark]);

  const loadTheme = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('themeMode');
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setThemeMode(stored as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, []);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setTheme(newMode);
  }, [isDark, setTheme]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  return useMemo(() => ({
    theme,
    themeMode,
    setTheme,
    toggleTheme,
    isDark,
  }), [theme, themeMode, setTheme, toggleTheme, isDark]);
});