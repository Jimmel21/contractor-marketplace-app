export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: string;
  images: string[];
  contractor: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
  };
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}