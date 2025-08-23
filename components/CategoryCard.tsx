import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ServiceCategory } from '@/types/service';
import { useTheme } from '@/hooks/theme-store';
import { 
  Code, 
  Palette, 
  PenTool, 
  TrendingUp, 
  Video, 
  Camera 
} from 'lucide-react-native';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, SCREEN_SIZES } from '@/constants/design-system';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
}

const iconMap = {
  code: Code,
  palette: Palette,
  'pen-tool': PenTool,
  'trending-up': TrendingUp,
  video: Video,
  camera: Camera,
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { theme } = useTheme();
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Code;

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.borderLight,
        shadowColor: theme.colors.shadow,
      }]} 
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <IconComponent 
          size={SCREEN_SIZES.isSmall ? 20 : SCREEN_SIZES.isTablet ? 32 : 28} 
          color="white" 
        />
      </View>
      <Text style={[styles.name, { color: theme.colors.text }]}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_SIZES.isSmall ? 110 : SCREEN_SIZES.isTablet ? 160 : 130,
    height: SCREEN_SIZES.isSmall ? 90 : SCREEN_SIZES.isTablet ? 140 : 110,
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
    marginLeft: SPACING.xs,
    ...SHADOWS.md,
  },
  iconContainer: {
    width: SCREEN_SIZES.isSmall ? 44 : SCREEN_SIZES.isTablet ? 64 : 56,
    height: SCREEN_SIZES.isSmall ? 44 : SCREEN_SIZES.isTablet ? 64 : 56,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  name: {
    ...TYPOGRAPHY.captionMedium,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});