export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: 'contractor' | 'client';
  rating: number;
  reviewCount: number;
  joinedDate: string;
  bio?: string;
  skills?: string[];
  location?: string;
}