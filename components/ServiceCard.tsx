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
      style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.borderLight }]} 
      onPress={handlePress}
      activeOpacity={0.95}
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
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: SCREEN_SIZES.isSmall ? 140 : SCREEN_SIZES.isTablet ? 200 : 160,
    backgroundColor: '#F3F4F6',
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: '#FF6B35',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  featuredText: {
    color: 'white',
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.sm,
  },
  contractorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: SCREEN_SIZES.isSmall ? 24 : 28,
    height: SCREEN_SIZES.isSmall ? 24 : 28,
    borderRadius: SCREEN_SIZES.isSmall ? 12 : 14,
    marginRight: SPACING.sm,
  },
  contractorName: {
    ...TYPOGRAPHY.captionMedium,
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
    ...TYPOGRAPHY.h4,
    fontWeight: '700',
  },
});