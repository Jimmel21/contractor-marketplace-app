export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: string;
  deliveryTimeInDays: number;
  images: string[];
  contractor: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    location: string;
  };
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  location: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ServiceFilters {
  category?: string;
  location?: string;
  minRating?: number;
  maxBudget?: number;
  maxDeliveryTime?: number;
  searchQuery?: string;
}

export interface FilterOptions {
  locations: string[];
  categories: string[];
  maxPrice: number;
  maxDeliveryDays: number;
}