import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';
import { Service } from '@/types/service';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const handlePress = () => {
    router.push(`/service-detail?id=${service.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: service.images[0] }} style={styles.image} />
      
      {service.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {service.title}
        </Text>
        
        <View style={styles.contractorInfo}>
          <Image 
            source={{ uri: service.contractor.avatar || 'https://via.placeholder.com/30' }} 
            style={styles.avatar} 
          />
          <Text style={styles.contractorName}>{service.contractor.name}</Text>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.rating}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>
              {service.rating} ({service.reviewCount})
            </Text>
          </View>
          <View style={styles.location}>
            <MapPin size={12} color="#999" />
            <Text style={styles.locationText}>{service.location}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.delivery}>
            <Clock size={14} color="#666" />
            <Text style={styles.deliveryText}>{service.deliveryTime}</Text>
          </View>
          <Text style={styles.price}>From ${service.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: isSmallScreen ? 10 : 12,
    marginBottom: isSmallScreen ? 12 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: isSmallScreen ? 140 : (isTablet ? 200 : 160),
    backgroundColor: '#f0f0f0',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: isSmallScreen ? 12 : (isTablet ? 20 : 16),
  },
  title: {
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: isSmallScreen ? 8 : 12,
    lineHeight: isSmallScreen ? 18 : (isTablet ? 24 : 22),
  },
  contractorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: isSmallScreen ? 20 : 24,
    height: isSmallScreen ? 20 : 24,
    borderRadius: isSmallScreen ? 10 : 12,
    marginRight: 8,
  },
  contractorName: {
    fontSize: isSmallScreen ? 12 : (isTablet ? 16 : 14),
    color: '#666',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: isSmallScreen ? 10 : (isTablet ? 14 : 12),
    color: '#999',
    marginLeft: 4,
  },
  ratingText: {
    fontSize: isSmallScreen ? 12 : (isTablet ? 16 : 14),
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delivery: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: isSmallScreen ? 12 : (isTablet ? 16 : 14),
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: isSmallScreen ? 16 : (isTablet ? 20 : 18),
    fontWeight: '700',
    color: '#1DBF73',
  },
});