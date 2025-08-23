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
import { useTheme } from '@/hooks/theme-store';
import { ServiceFilters } from '@/types/service';
import { 
  TYPOGRAPHY, 
  SPACING, 
  BORDER_RADIUS, 
  SHADOWS, 
  SCREEN_SIZES, 
  GRADIENTS,
  LAYOUT 
} from '@/constants/design-system';

const isWeb = Platform.OS === 'web';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<ServiceFilters>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading services...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={GRADIENTS.primary}
        style={[styles.header, { paddingTop: Math.max(insets.top + SPACING.md, 50) }]}
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
          <View style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}>
            <Search size={20} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textTertiary}
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

      <ScrollView style={[styles.content, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
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
                    <Text style={[styles.activeFilterText, { color: theme.colors.primary }]}>Category: {selectedCategory}</Text>
                    <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.location && (
                  <View style={styles.activeFilterChip}>
                    <MapPin size={12} color="#1976D2" />
                    <Text style={[styles.activeFilterText, { color: theme.colors.primary }]}>{filters.location}</Text>
                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, location: undefined }))}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.minRating && (
                  <View style={styles.activeFilterChip}>
                    <Star size={12} color="#1976D2" fill="#1976D2" />
                    <Text style={[styles.activeFilterText, { color: theme.colors.primary }]}>{filters.minRating}+</Text>
                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, minRating: undefined }))}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.maxBudget && (
                  <View style={styles.activeFilterChip}>
                    <DollarSign size={12} color="#1976D2" />
                    <Text style={[styles.activeFilterText, { color: theme.colors.primary }]}>Under ${filters.maxBudget}</Text>
                    <TouchableOpacity onPress={() => setFilters(prev => ({ ...prev, maxBudget: undefined }))}>
                      <Text style={styles.removeFilter}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.maxDeliveryTime && (
                  <View style={styles.activeFilterChip}>
                    <Clock size={12} color="#1976D2" />
                    <Text style={[styles.activeFilterText, { color: theme.colors.primary }]}>{filters.maxDeliveryTime} day{filters.maxDeliveryTime > 1 ? 's' : ''}</Text>
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
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Services</Text>
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {featuredServices.length > 0 ? 'More Services' : 'All Services'}
          </Text>
          {regularServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </View>

        {filteredServices.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No services found</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
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
            right: LAYOUT.containerPadding,
            width: SCREEN_SIZES.isSmall ? 50 : 56,
            height: SCREEN_SIZES.isSmall ? 50 : 56,
            borderRadius: BORDER_RADIUS.full
          }]} 
          onPress={handleCreateService}
          activeOpacity={0.8}
        >
          <Plus size={SCREEN_SIZES.isSmall ? 20 : 24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    ...(isWeb && SCREEN_SIZES.isTablet ? {} : isWeb ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : {}),
  },
  header: {
    paddingHorizontal: LAYOUT.containerPadding,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: 'white',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadge: {
    position: 'absolute',
    top: -SPACING.xs,
    right: -SPACING.xs,
    backgroundColor: '#FF4444',
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: 'white',
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: LAYOUT.containerPadding,
    paddingVertical: LAYOUT.sectionSpacing,
    paddingBottom: 0,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  categoriesList: {
    paddingRight: LAYOUT.containerPadding,
  },
  activeFiltersContainer: {
    marginHorizontal: LAYOUT.containerPadding,
    marginBottom: SPACING.md,
  },
  activeFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.xs,
  },
  activeFilterText: {
    ...TYPOGRAPHY.small,
    fontWeight: '500',
  },
  removeFilter: {
    ...TYPOGRAPHY.body,
    color: '#1976D2',
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  clearAllButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
  },
  clearAllText: {
    ...TYPOGRAPHY.small,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: SCREEN_SIZES.isTablet ? SPACING.xxxl * 2 : SPACING.xxxl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    maxWidth: SCREEN_SIZES.isTablet ? 400 : '100%',
  },
  clearFiltersButton: {
    backgroundColor: '#1DBF73',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  clearFiltersButtonText: {
    color: 'white',
    ...TYPOGRAPHY.bodyMedium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.lg,
    ...TYPOGRAPHY.body,
  },
  floatingButton: {
    position: 'absolute',
    backgroundColor: '#1DBF73',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.xl,
  },
};

const styles = StyleSheet.create(baseStyles);