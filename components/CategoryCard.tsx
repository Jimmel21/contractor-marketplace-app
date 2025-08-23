import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      }]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <IconComponent 
          size={SCREEN_SIZES.isSmall ? 18 : SCREEN_SIZES.isTablet ? 28 : 24} 
          color="white" 
        />
      </View>
      <Text style={[styles.name, { color: theme.colors.text }]}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_SIZES.isSmall ? 100 : SCREEN_SIZES.isTablet ? 140 : 120,
    height: SCREEN_SIZES.isSmall ? 80 : SCREEN_SIZES.isTablet ? 120 : 100,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  iconContainer: {
    width: SCREEN_SIZES.isSmall ? 36 : SCREEN_SIZES.isTablet ? 56 : 48,
    height: SCREEN_SIZES.isSmall ? 36 : SCREEN_SIZES.isTablet ? 56 : 48,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  name: {
    ...TYPOGRAPHY.smallMedium,
    textAlign: 'center',
  },
});