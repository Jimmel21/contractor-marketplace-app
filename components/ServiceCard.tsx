import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';
import { Service } from '@/types/service';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS, SCREEN_SIZES } from '@/constants/design-system';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { theme } = useTheme();
  
  const handlePress = () => {
    router.push(`/service-detail?id=${service.id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: theme.colors.card, 
        borderColor: theme.colors.borderLight,
        shadowColor: theme.colors.shadow,
      }]} 
      onPress={handlePress}
      activeOpacity={0.92}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: service.images[0] }} style={styles.image} />
        {service.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {service.title}
        </Text>
        
        <View style={styles.contractorInfo}>
          <Image 
            source={{ uri: service.contractor.avatar || 'https://via.placeholder.com/32' }} 
            style={styles.avatar} 
          />
          <Text style={[styles.contractorName, { color: theme.colors.textSecondary }]}>
            {service.contractor.name}
          </Text>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.rating}>
            <Star size={SCREEN_SIZES.isSmall ? 12 : 14} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
              {service.rating} ({service.reviewCount})
            </Text>
          </View>
          <View style={styles.location}>
            <MapPin size={SCREEN_SIZES.isSmall ? 10 : 12} color={theme.colors.textTertiary} />
            <Text style={[styles.locationText, { color: theme.colors.textTertiary }]}>
              {service.location}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.delivery}>
            <Clock size={SCREEN_SIZES.isSmall ? 12 : 14} color={theme.colors.textSecondary} />
            <Text style={[styles.deliveryText, { color: theme.colors.textSecondary }]}>
              {service.deliveryTime}
            </Text>
          </View>
          <Text style={[styles.price, { color: theme.colors.primary }]}>From ${service.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xxl,
    marginBottom: SPACING.xl,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: SCREEN_SIZES.isSmall ? 160 : SCREEN_SIZES.isTablet ? 220 : 180,
    backgroundColor: '#F3F4F6',
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.lg,
    left: SPACING.lg,
    backgroundColor: '#FF6B35',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  featuredText: {
    color: 'white',
    ...TYPOGRAPHY.small,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    padding: SPACING.xl,
  },
  title: {
    fontSize: SCREEN_SIZES.isSmall ? 16 : SCREEN_SIZES.isTablet ? 20 : 18,
    fontWeight: '700' as const,
    marginBottom: SPACING.md,
    letterSpacing: -0.2,
  },
  contractorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: SCREEN_SIZES.isSmall ? 28 : 32,
    height: SCREEN_SIZES.isSmall ? 28 : 32,
    borderRadius: SCREEN_SIZES.isSmall ? 14 : 16,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  contractorName: {
    ...TYPOGRAPHY.captionMedium,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  locationText: {
    ...TYPOGRAPHY.small,
  },
  ratingText: {
    ...TYPOGRAPHY.captionMedium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delivery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  deliveryText: {
    ...TYPOGRAPHY.caption,
  },
  price: {
    fontSize: SCREEN_SIZES.isSmall ? 16 : SCREEN_SIZES.isTablet ? 20 : 18,
    fontWeight: '800' as const,
    letterSpacing: -0.2,
  },
});