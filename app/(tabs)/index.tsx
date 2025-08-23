import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Star, DollarSign, Clock, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceCard from '@/components/ServiceCard';
import CategoryCard from '@/components/CategoryCard';
import FilterModal from '@/components/FilterModal';
import { mockServices, getFilterOptions } from '@/mocks/services';
import { categories } from '@/constants/categories';
import { useAuth } from '@/hooks/auth-store';
import { ServiceFilters } from '@/types/service';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;
const isWeb = Platform.OS === 'web';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServiceFilters>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleCreateService = () => {
    router.push('/create-service');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
          <ActivityIndicator size="large" color="#1DBF73" />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1DBF73', '#17A85C']}
        style={[styles.header, { paddingTop: Math.max(insets.top + 10, 50) }]}
      >
        <Text style={[styles.greeting, { fontSize: isSmallScreen ? 20 : (isTablet ? 28 : 24) }]}>
          Hello, {user?.name?.split(' ')[0] || 'there'}! 👋
        </Text>
        <Text style={[styles.subtitle, { fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16) }]}>
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

      {user?.type === 'contractor' && (
        <TouchableOpacity 
          style={[styles.floatingButton, { 
            bottom: Platform.OS === 'ios' ? 90 + insets.bottom : 90,
            right: isSmallScreen ? 16 : 20,
            width: isSmallScreen ? 50 : 56,
            height: isSmallScreen ? 50 : 56,
            borderRadius: isSmallScreen ? 25 : 28
          }]} 
          onPress={handleCreateService}
          activeOpacity={0.8}
        >
          <Plus size={isSmallScreen ? 20 : 24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '#1DBF73',
    ...(isWeb && isTablet ? {} : isWeb ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : {}),
  },
  header: {
    paddingHorizontal: isSmallScreen ? 16 : (isTablet ? 32 : 20),
    paddingBottom: isSmallScreen ? 16 : 20,
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
    marginBottom: isSmallScreen ? 16 : 20,
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
    borderRadius: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 10 : 12,
    marginRight: isSmallScreen ? 8 : 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    color: '#1a1a1a',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: isSmallScreen ? 10 : 12,
    borderRadius: isSmallScreen ? 10 : 12,
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
    backgroundColor: '#f8f9fa',
  },
  section: {
    paddingHorizontal: isSmallScreen ? 16 : (isTablet ? 32 : 20),
    paddingVertical: isSmallScreen ? 12 : 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : (isTablet ? 24 : 20),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: isSmallScreen ? 12 : 16,
  },
  categoriesList: {
    paddingRight: isSmallScreen ? 16 : 20,
  },
  activeFiltersContainer: {
    marginHorizontal: isSmallScreen ? 16 : (isTablet ? 32 : 20),
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
    paddingHorizontal: isSmallScreen ? 8 : 12,
    paddingVertical: isSmallScreen ? 4 : 6,
    borderRadius: isSmallScreen ? 12 : 16,
    gap: 4,
  },
  activeFilterText: {
    fontSize: isSmallScreen ? 10 : (isTablet ? 14 : 12),
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
    paddingHorizontal: isSmallScreen ? 8 : 12,
    paddingVertical: isSmallScreen ? 4 : 6,
    borderRadius: isSmallScreen ? 12 : 16,
  },
  clearAllText: {
    fontSize: isSmallScreen ? 10 : (isTablet ? 14 : 12),
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: isSmallScreen ? 24 : (isTablet ? 60 : 40),
  },
  emptyTitle: {
    fontSize: isSmallScreen ? 16 : (isTablet ? 22 : 18),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: isSmallScreen ? 12 : (isTablet ? 16 : 14),
    color: '#666',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 16 : 20,
    maxWidth: isTablet ? 400 : '100%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    color: '#666',
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    backgroundColor: '#1DBF73',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
};

const styles = StyleSheet.create(baseStyles);