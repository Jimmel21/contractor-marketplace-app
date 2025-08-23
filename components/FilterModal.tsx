import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { X, MapPin, Star, DollarSign, Clock } from 'lucide-react-native';
import { ServiceFilters, FilterOptions } from '@/types/service';

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
  const [localFilters, setLocalFilters] = useState<ServiceFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: ServiceFilters = {};
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  const updateFilter = (key: keyof ServiceFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const budgetOptions = [50, 100, 200, 300, 500, 1000];
  const deliveryOptions = [1, 3, 7, 14, 30];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Services</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#1DBF73" />
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipContainer}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    !localFilters.location && styles.chipSelected,
                  ]}
                  onPress={() => updateFilter('location', undefined)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      !localFilters.location && styles.chipTextSelected,
                    ]}
                  >
                    All Locations
                  </Text>
                </TouchableOpacity>
                {filterOptions.locations.map((location) => (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.chip,
                      localFilters.location === location && styles.chipSelected,
                    ]}
                    onPress={() => updateFilter('location', location)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        localFilters.location === location && styles.chipTextSelected,
                      ]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#1DBF73" />
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
            </View>
            <View style={styles.ratingContainer}>
              {[3, 3.5, 4, 4.5, 4.8].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingChip,
                    localFilters.minRating === rating && styles.chipSelected,
                  ]}
                  onPress={() => 
                    updateFilter('minRating', localFilters.minRating === rating ? undefined : rating)
                  }
                >
                  <Star 
                    size={16} 
                    color={localFilters.minRating === rating ? 'white' : '#FFD700'} 
                    fill={localFilters.minRating === rating ? 'white' : '#FFD700'}
                  />
                  <Text
                    style={[
                      styles.ratingText,
                      localFilters.minRating === rating && styles.chipTextSelected,
                    ]}
                  >
                    {rating}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color="#1DBF73" />
              <Text style={styles.sectionTitle}>Budget</Text>
            </View>
            <View style={styles.budgetContainer}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  !localFilters.maxBudget && styles.chipSelected,
                ]}
                onPress={() => updateFilter('maxBudget', undefined)}
              >
                <Text
                  style={[
                    styles.chipText,
                    !localFilters.maxBudget && styles.chipTextSelected,
                  ]}
                >
                  Any Budget
                </Text>
              </TouchableOpacity>
              {budgetOptions.map((budget) => (
                <TouchableOpacity
                  key={budget}
                  style={[
                    styles.chip,
                    localFilters.maxBudget === budget && styles.chipSelected,
                  ]}
                  onPress={() => updateFilter('maxBudget', budget)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilters.maxBudget === budget && styles.chipTextSelected,
                    ]}
                  >
                    Under ${budget}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#1DBF73" />
              <Text style={styles.sectionTitle}>Delivery Time</Text>
            </View>
            <View style={styles.deliveryContainer}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  !localFilters.maxDeliveryTime && styles.chipSelected,
                ]}
                onPress={() => updateFilter('maxDeliveryTime', undefined)}
              >
                <Text
                  style={[
                    styles.chipText,
                    !localFilters.maxDeliveryTime && styles.chipTextSelected,
                  ]}
                >
                  Any Time
                </Text>
              </TouchableOpacity>
              {deliveryOptions.map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.chip,
                    localFilters.maxDeliveryTime === days && styles.chipSelected,
                  ]}
                  onPress={() => updateFilter('maxDeliveryTime', days)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localFilters.maxDeliveryTime === days && styles.chipTextSelected,
                    ]}
                  >
                    {days} day{days > 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#1DBF73',
    borderColor: '#1DBF73',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: 'white',
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  budgetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  deliveryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#1DBF73',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});