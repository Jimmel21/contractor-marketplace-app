import { Platform, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const BREAKPOINTS = {
  small: 375,
  tablet: 768,
  desktop: 1024,
} as const;

export const SCREEN_SIZES = {
  isSmall: screenWidth < BREAKPOINTS.small,
  isTablet: screenWidth >= BREAKPOINTS.tablet,
  isDesktop: screenWidth >= BREAKPOINTS.desktop,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
} as const;

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const TYPOGRAPHY = {
  h1: {
    fontSize: SCREEN_SIZES.isSmall ? 24 : SCREEN_SIZES.isTablet ? 36 : 32,
    fontWeight: '700' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 32 : SCREEN_SIZES.isTablet ? 44 : 40,
  },
  h2: {
    fontSize: SCREEN_SIZES.isSmall ? 20 : SCREEN_SIZES.isTablet ? 28 : 24,
    fontWeight: '700' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 28 : SCREEN_SIZES.isTablet ? 36 : 32,
  },
  h3: {
    fontSize: SCREEN_SIZES.isSmall ? 18 : SCREEN_SIZES.isTablet ? 24 : 20,
    fontWeight: '600' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 24 : SCREEN_SIZES.isTablet ? 32 : 28,
  },
  h4: {
    fontSize: SCREEN_SIZES.isSmall ? 16 : SCREEN_SIZES.isTablet ? 20 : 18,
    fontWeight: '600' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 22 : SCREEN_SIZES.isTablet ? 28 : 24,
  },
  body: {
    fontSize: SCREEN_SIZES.isSmall ? 14 : SCREEN_SIZES.isTablet ? 18 : 16,
    fontWeight: '400' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 20 : SCREEN_SIZES.isTablet ? 26 : 24,
  },
  bodyMedium: {
    fontSize: SCREEN_SIZES.isSmall ? 14 : SCREEN_SIZES.isTablet ? 18 : 16,
    fontWeight: '500' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 20 : SCREEN_SIZES.isTablet ? 26 : 24,
  },
  bodySemibold: {
    fontSize: SCREEN_SIZES.isSmall ? 14 : SCREEN_SIZES.isTablet ? 18 : 16,
    fontWeight: '600' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 20 : SCREEN_SIZES.isTablet ? 26 : 24,
  },
  caption: {
    fontSize: SCREEN_SIZES.isSmall ? 12 : SCREEN_SIZES.isTablet ? 16 : 14,
    fontWeight: '400' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 16 : SCREEN_SIZES.isTablet ? 22 : 20,
  },
  captionMedium: {
    fontSize: SCREEN_SIZES.isSmall ? 12 : SCREEN_SIZES.isTablet ? 16 : 14,
    fontWeight: '500' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 16 : SCREEN_SIZES.isTablet ? 22 : 20,
  },
  small: {
    fontSize: SCREEN_SIZES.isSmall ? 10 : SCREEN_SIZES.isTablet ? 14 : 12,
    fontWeight: '400' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 14 : SCREEN_SIZES.isTablet ? 18 : 16,
  },
  smallMedium: {
    fontSize: SCREEN_SIZES.isSmall ? 10 : SCREEN_SIZES.isTablet ? 14 : 12,
    fontWeight: '500' as const,
    lineHeight: SCREEN_SIZES.isSmall ? 14 : SCREEN_SIZES.isTablet ? 18 : 16,
  },
} as const;

export const GRADIENTS = {
  primary: ['#1DBF73', '#17A85C'],
  primaryLight: ['#E8F5E8', '#F0F9F0'],
  secondary: ['#667eea', '#764ba2'],
  accent: ['#f093fb', '#f5576c'],
  success: ['#11998e', '#38ef7d'],
  warning: ['#f093fb', '#f5576c'],
  error: ['#ff6b6b', '#ee5a52'],
  neutral: ['#f8f9fa', '#e9ecef'],
  dark: ['#2c3e50', '#34495e'],
} as const;

export const COLORS = {
  // Brand Colors
  primary: '#1DBF73',
  primaryDark: '#17A85C',
  primaryLight: '#E8F5E8',
  
  // Neutral Colors
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',
  
  // Semantic Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Platform Specific
  iosBlue: '#007AFF',
  androidGreen: '#4CAF50',
} as const;

export const PLATFORM_STYLES = {
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
  }),
} as const;

export const ANIMATIONS = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

export const LAYOUT = {
  containerPadding: SCREEN_SIZES.isSmall ? SPACING.lg : SCREEN_SIZES.isTablet ? SPACING.xxxl : SPACING.xl,
  sectionSpacing: SCREEN_SIZES.isSmall ? SPACING.lg : SPACING.xxl,
  cardSpacing: SCREEN_SIZES.isSmall ? SPACING.md : SPACING.lg,
  maxWidth: SCREEN_SIZES.isTablet ? 1200 : '100%',
} as const;