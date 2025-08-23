import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import { X, MapPin, Star, DollarSign, Clock, Check } from 'lucide-react-native';
import { ServiceFilters, FilterOptions } from '@/types/service';
import { useTheme } from '@/hooks/theme-store';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, PLATFORM_STYLES } from '@/constants/design-system';
import * as Haptics from 'expo-haptics';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: ServiceFilters;
  onApplyFilters: (filters: ServiceFilters) => void;
  filterOptions: FilterOptions;
}

export default function FilterModal({
  visible,
  onClose,
  filters,
  onApplyFilters,
  filterOptions,
}: FilterModalProps) {
  const { theme } = useTheme();
  const [localFilters, setLocalFilters] = useState<ServiceFilters>(filters);
  const [animatedValues] = useState(() => ({
    scale: new Animated.Value(0.95),
    opacity: new Animated.Value(0),
  }));

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(animatedValues.scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(animatedValues.opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      animatedValues.scale.setValue(0.95);
      animatedValues.opacity.setValue(0);
    }
  }, [visible]);

  const handleApply = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const resetFilters: ServiceFilters = {};
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  const updateFilter = (key: keyof ServiceFilters, value: any) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderFilterChip = ({
    label,
    isSelected,
    onPress,
    icon,
  }: {
    label: string;
    isSelected: boolean;
    onPress: () => void;
    icon?: React.ReactNode;
  }) => {
    const chipStyle = [
      styles.modernChip,
      {
        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
        ...PLATFORM_STYLES.button,
      },
    ];

    return (
      <Pressable
        style={({ pressed }) => [
          chipStyle,
          pressed && Platform.OS === 'ios' && { opacity: 0.7 },
          pressed && Platform.OS === 'android' && { backgroundColor: isSelected ? theme.colors.primary + '90' : theme.colors.borderLight },
        ]}
        onPress={onPress}
        android_ripple={Platform.OS === 'android' ? {
          color: isSelected ? 'rgba(255,255,255,0.2)' : theme.colors.primary + '20',
          borderless: false,
        } : undefined}
      >
        <View style={styles.chipContent}>
          {icon && <View style={styles.chipIcon}>{icon}</View>}
          <Text style={[
            styles.modernChipText,
            { color: isSelected ? COLORS.white : theme.colors.text }
          ]}>
            {label}
          </Text>
          {isSelected && (
            <Check size={16} color={COLORS.white} style={styles.checkIcon} />
          )}
        </View>
      </Pressable>
    );
  };

  const budgetOptions = [50, 100, 200, 300, 500, 1000];
  const deliveryOptions = [1, 3, 7, 14, 30];

  const modalStyle = Platform.select({
    ios: 'pageSheet',
    android: 'overFullScreen',
    default: 'overFullScreen',
  }) as any;

  return (
    <Modal
      visible={visible}
      animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
      presentationStyle={modalStyle}
      onRequestClose={onClose}
      transparent={Platform.OS !== 'ios'}
    >
      {Platform.OS !== 'ios' && (
        <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]} />
      )}
      <Animated.View 
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            transform: [{ scale: animatedValues.scale }],
            opacity: animatedValues.opacity,
          },
          Platform.OS !== 'ios' && styles.androidModal,
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerIndicator} />
            <Text style={[styles.title, { color: theme.colors.text }, TYPOGRAPHY.h3]}>Filter Services</Text>
            <Pressable 
              onPress={onClose} 
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: theme.colors.borderLight },
                pressed && { opacity: 0.7 }
              ]}
              android_ripple={{ color: theme.colors.border, borderless: true }}
            >
              <X size={20} color={theme.colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { borderBottomColor: theme.colors.borderLight }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                <MapPin size={18} color={theme.colors.primary} />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }, TYPOGRAPHY.h4]}>Location</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              <View style={styles.chipContainer}>
                {renderFilterChip({
                  label: 'All Locations',
                  isSelected: !localFilters.location,
                  onPress: () => updateFilter('location', undefined),
                  icon: <MapPin size={14} color={!localFilters.location ? COLORS.white : theme.colors.textTertiary} />,
                })}
                {filterOptions.locations.map((location) => (
                  <View key={location}>
                    {renderFilterChip({
                      label: location,
                      isSelected: localFilters.location === location,
                      onPress: () => updateFilter('location', location),
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={[styles.section, { borderBottomColor: theme.colors.borderLight }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }, TYPOGRAPHY.h4]}>Minimum Rating</Text>
            </View>
            <View style={styles.ratingContainer}>
              {[3, 3.5, 4, 4.5, 4.8].map((rating) => (
                <View key={rating.toString()}>
                  {renderFilterChip({
                    label: `${rating}+`,
                    isSelected: localFilters.minRating === rating,
                    onPress: () => updateFilter('minRating', localFilters.minRating === rating ? undefined : rating),
                    icon: <Star 
                      size={14} 
                      color={localFilters.minRating === rating ? COLORS.white : '#F59E0B'} 
                      fill={localFilters.minRating === rating ? COLORS.white : '#F59E0B'}
                    />,
                  })}
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.section, { borderBottomColor: theme.colors.borderLight }]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                <DollarSign size={18} color="#3B82F6" />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }, TYPOGRAPHY.h4]}>Budget</Text>
            </View>
            <View style={styles.budgetContainer}>
              {renderFilterChip({
                label: 'Any Budget',
                isSelected: !localFilters.maxBudget,
                onPress: () => updateFilter('maxBudget', undefined),
                icon: <DollarSign size={14} color={!localFilters.maxBudget ? COLORS.white : theme.colors.textTertiary} />,
              })}
              {budgetOptions.map((budget) => (
                <View key={budget.toString()}>
                  {renderFilterChip({
                    label: `Under ${budget}`,
                    isSelected: localFilters.maxBudget === budget,
                    onPress: () => updateFilter('maxBudget', budget),
                  })}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Clock size={18} color="#EF4444" />
              </View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }, TYPOGRAPHY.h4]}>Delivery Time</Text>
            </View>
            <View style={styles.deliveryContainer}>
              {renderFilterChip({
                label: 'Any Time',
                isSelected: !localFilters.maxDeliveryTime,
                onPress: () => updateFilter('maxDeliveryTime', undefined),
                icon: <Clock size={14} color={!localFilters.maxDeliveryTime ? COLORS.white : theme.colors.textTertiary} />,
              })}
              {deliveryOptions.map((days) => (
                <View key={days.toString()}>
                  {renderFilterChip({
                    label: `${days} day${days > 1 ? 's' : ''}`,
                    isSelected: localFilters.maxDeliveryTime === days,
                    onPress: () => updateFilter('maxDeliveryTime', days),
                  })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.background }]}>
          <Pressable 
            style={({ pressed }) => [
              styles.resetButton,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
              pressed && { opacity: 0.7 }
            ]}
            onPress={handleReset}
            android_ripple={{ color: theme.colors.border }}
          >
            <Text style={[styles.resetButtonText, { color: theme.colors.textSecondary }, TYPOGRAPHY.bodySemibold]}>Reset</Text>
          </Pressable>
          <Pressable 
            style={({ pressed }) => [
              styles.applyButton,
              {
                backgroundColor: theme.colors.primary,
                ...PLATFORM_STYLES.button,
              },
              pressed && Platform.OS === 'ios' && { opacity: 0.8 }
            ]}
            onPress={handleApply}
            android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
          >
            <Text style={[styles.applyButtonText, TYPOGRAPHY.bodySemibold]}>Apply Filters</Text>
          </Pressable>
        </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    ...Platform.select({
      ios: {},
      android: {
        marginTop: 60,
        borderTopLeftRadius: BORDER_RADIUS.xxl,
        borderTopRightRadius: BORDER_RADIUS.xxl,
        overflow: 'hidden',
      },
      default: {
        marginTop: 60,
        borderTopLeftRadius: BORDER_RADIUS.xxl,
        borderTopRightRadius: BORDER_RADIUS.xxl,
        overflow: 'hidden',
      },
    }),
  },
  androidModal: {
    ...SHADOWS.xl,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingBottom: SPACING.lg,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  headerIndicator: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  closeButton: {
    position: 'absolute',
    right: SPACING.xl,
    top: SPACING.md + 20,
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  sectionTitle: {
    flex: 1,
  },
  horizontalScroll: {
    paddingRight: SPACING.xl,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  modernChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIcon: {
    marginRight: SPACING.xs,
  },
  modernChipText: {
    ...TYPOGRAPHY.bodyMedium,
    textAlign: 'center',
  },
  checkIcon: {
    marginLeft: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  budgetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  deliveryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
    borderTopWidth: 1,
  },
  resetButton: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    minHeight: 52,
  },
  resetButtonText: {
    textAlign: 'center',
  },
  applyButton: {
    flex: 2,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  applyButtonText: {
    color: COLORS.white,
    textAlign: 'center',
  },
});