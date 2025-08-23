import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ServiceCategory } from '@/types/service';
import { 
  Code, 
  Palette, 
  PenTool, 
  TrendingUp, 
  Video, 
  Camera 
} from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;

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
  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Code;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: category.color + '15' }]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
        <IconComponent size={isSmallScreen ? 18 : (isTablet ? 28 : 24)} color="white" />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: isSmallScreen ? 100 : (isTablet ? 140 : 120),
    height: isSmallScreen ? 80 : (isTablet ? 120 : 100),
    borderRadius: isSmallScreen ? 10 : 12,
    padding: isSmallScreen ? 12 : (isTablet ? 20 : 16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isSmallScreen ? 8 : 12,
  },
  iconContainer: {
    width: isSmallScreen ? 36 : (isTablet ? 56 : 48),
    height: isSmallScreen ? 36 : (isTablet ? 56 : 48),
    borderRadius: isSmallScreen ? 18 : (isTablet ? 28 : 24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallScreen ? 6 : 8,
  },
  name: {
    fontSize: isSmallScreen ? 10 : (isTablet ? 14 : 12),
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});