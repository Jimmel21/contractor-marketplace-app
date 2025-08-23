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
  background: '#f8f9fa',
  surface: '#ffffff',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  primary: '#1DBF73',
  primaryLight: '#f8fff9',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
  success: '#1DBF73',
  error: '#FF4444',
  warning: '#FFA500',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
};

const darkTheme: Theme['colors'] = {
  background: '#121212',
  surface: '#1e1e1e',
  card: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  textTertiary: '#808080',
  primary: '#1DBF73',
  primaryLight: '#0a2f1a',
  border: '#404040',
  borderLight: '#333333',
  success: '#1DBF73',
  error: '#FF6B6B',
  warning: '#FFB347',
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