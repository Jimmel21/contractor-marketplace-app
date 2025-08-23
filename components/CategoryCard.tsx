import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ServiceCategory } from '@/types/service';
import { 
  Code, 
  Palette, 
  PenTool, 
  TrendingUp, 
  Video, 
  Camera 
} from 'lucide-react-native';

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
        <IconComponent size={24} color="white" />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 100,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});