import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native';
import { Search, Filter, MapPin, Star, DollarSign, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceCard from '@/components/ServiceCard';
import CategoryCard from '@/components/CategoryCard';
import FilterModal from '@/components/FilterModal';
import { mockServices, getFilterOptions } from '@/mocks/services';
import { categories } from '@/constants/categories';
import { useAuth } from '@/hooks/auth-store';
import { ServiceFilters } from '@/types/service';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServiceFilters>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { user } = useAuth();

  const filterOptions = useMemo(() => getFilterOptions(), []);

  const filteredServices = useMemo(() => {
    return mockServices.filter(service => {
      const matchesSearch = searchQuery === '' || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.contractor.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      
      const matchesLocation = !filters.location || service.location === filters.location;
      
      const matchesRating = !filters.minRating || service.rating >= filters.minRating;
      
      const matchesBudget = !filters.maxBudget || service.price <= filters.maxBudget;
      
      const matchesDelivery = !filters.maxDeliveryTime || service.deliveryTimeInDays <= filters.maxDeliveryTime;
      
      return matchesSearch && matchesCategory && matchesLocation && matchesRating && matchesBudget && matchesDelivery;
    });
  }, [searchQuery, selectedCategory, filters]);

  const featuredServices = filteredServices.filter(service => service.featured);
  const regularServices = filteredServices.filter(service => !service.featured);

  const activeFiltersCount = Object.keys(filters).filter(key => filters[key as keyof ServiceFilters] !== undefined).length;

  const handleApplyFilters = (newFilters: ServiceFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSelectedCategory(null);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1DBF73', '#17A85C']}
        style={styles.header}
      >
        <Text style={styles.greeting}>
          Hello, {user?.name?.split(' ')[0] || 'there'}! 👋
        </Text>
        <Text style={styles.subtitle}>
          {user?.type === 'contractor' 
            ? 'Ready to showcase your skills?' 
            : 'Find the perfect service for your needs'
          }
        </Text>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]} 
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="white" />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={() => setSelectedCategory(
                  selectedCategory === item.name ? null : item.name
                )}
              />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {(selectedCategory || activeFiltersCount > 0) && (
          <View style={styles.activeFiltersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.activeFiltersRow}>
                {selectedCategory && (
                  <View style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>Category: {selectedCategory}</Text>
                    <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.location && (
                  <View style={styles.activeFilterChip}>
                    <MapPin size={12} color="#1976D2" />
                    <Text style={styles.activeFilterText}>{filters.location}</Text>
                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, location: undefined }))}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.minRating && (
                  <View style={styles.activeFilterChip}>
                    <Star size={12} color="#1976D2" fill="#1976D2" />
                    <Text style={styles.activeFilterText}>{filters.minRating}+</Text>
                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, minRating: undefined }))}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.maxBudget && (
                  <View style={styles.activeFilterChip}>
                    <DollarSign size={12} color="#1976D2" />
                    <Text style={styles.activeFilterText}>Under ${filters.maxBudget}</Text>
                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, maxBudget: undefined }))}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.maxDeliveryTime && (
                  <View style={styles.activeFilterChip}>
                    <Clock size={12} color="#1976D2" />
                    <Text style={styles.activeFilterText}>{filters.maxDeliveryTime} day{filters.maxDeliveryTime > 1 ? 's' : ''}</Text>
                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, maxDeliveryTime: undefined }))}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {(selectedCategory || activeFiltersCount > 0) && (
                  <TouchableOpacity style={styles.clearAllButton} onPress={clearAllFilters}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        {featuredServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {featuredServices.length > 0 ? 'More Services' : 'All Services'}
          </Text>
          {regularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </View>

        {filteredServices.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or browse different categories
            </Text>
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
              <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        filterOptions={filterOptions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  categoriesList: {
    paddingRight: 20,
  },
  activeFiltersContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  removeFilter: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '600',
    marginLeft: 4,
  },
  clearAllButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearAllText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#1DBF73',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});