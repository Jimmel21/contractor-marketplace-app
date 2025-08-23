import { Service, FilterOptions } from '@/types/service';

export const getFilterOptions = (): FilterOptions => {
  const locations = [...new Set(mockServices.map(service => service.location))].sort();
  const categories = [...new Set(mockServices.map(service => service.category))].sort();
  const maxPrice = Math.max(...mockServices.map(service => service.price));
  const maxDeliveryDays = Math.max(...mockServices.map(service => service.deliveryTimeInDays));
  
  return {
    locations,
    categories,
    maxPrice,
    maxDeliveryDays
  };
};

export const mockServices: Service[] = [
  {
    id: '1',
    title: 'I will create a modern responsive website for your business',
    description: 'Professional web development service with React, Next.js, and modern design principles. Includes responsive design, SEO optimization, and fast loading times.',
    category: 'Web Development',
    price: 299,
    deliveryTime: '7 days',
    deliveryTimeInDays: 7,
    location: 'New York, NY',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 127,
      location: 'New York, NY'
    },
    tags: ['React', 'Next.js', 'Responsive', 'SEO'],
    rating: 4.9,
    reviewCount: 89,
    featured: true
  },
  {
    id: '2',
    title: 'I will design a stunning logo for your brand',
    description: 'Creative logo design that captures your brand essence. Includes multiple concepts, unlimited revisions, and all file formats.',
    category: 'Graphic Design',
    price: 149,
    deliveryTime: '3 days',
    deliveryTimeInDays: 3,
    location: 'Los Angeles, CA',
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 203,
      location: 'Los Angeles, CA'
    },
    tags: ['Logo', 'Branding', 'Creative', 'Professional'],
    rating: 4.8,
    reviewCount: 156,
    featured: false
  },
  {
    id: '3',
    title: 'I will write engaging content for your website or blog',
    description: 'Professional copywriting services for websites, blogs, and marketing materials. SEO-optimized content that converts.',
    category: 'Writing',
    price: 89,
    deliveryTime: '2 days',
    deliveryTimeInDays: 2,
    location: 'Chicago, IL',
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      reviewCount: 94,
      location: 'Chicago, IL'
    },
    tags: ['Copywriting', 'SEO', 'Blog', 'Content'],
    rating: 4.7,
    reviewCount: 67,
    featured: true
  },
  {
    id: '4',
    title: 'I will create a comprehensive social media strategy',
    description: 'Complete social media marketing strategy including content calendar, hashtag research, and growth tactics.',
    category: 'Marketing',
    price: 199,
    deliveryTime: '5 days',
    deliveryTimeInDays: 5,
    location: 'Miami, FL',
    images: [
      'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '4',
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 178,
      location: 'Miami, FL'
    },
    tags: ['Social Media', 'Strategy', 'Growth', 'Content'],
    rating: 4.9,
    reviewCount: 134,
    featured: false
  },
  {
    id: '5',
    title: 'I will develop a mobile app for iOS and Android',
    description: 'Cross-platform mobile app development using React Native. Includes UI/UX design, backend integration, and app store deployment.',
    category: 'Mobile Development',
    price: 599,
    deliveryTime: '14 days',
    deliveryTimeInDays: 14,
    location: 'San Francisco, CA',
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '5',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 85,
      location: 'San Francisco, CA'
    },
    tags: ['React Native', 'iOS', 'Android', 'Mobile'],
    rating: 4.9,
    reviewCount: 72,
    featured: true
  },
  {
    id: '6',
    title: 'I will create professional video content for your brand',
    description: 'High-quality video production including scripting, filming, and editing. Perfect for marketing campaigns and social media.',
    category: 'Video Production',
    price: 399,
    deliveryTime: '10 days',
    deliveryTimeInDays: 10,
    location: 'Austin, TX',
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '6',
      name: 'Jessica Martinez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 4.6,
      reviewCount: 156,
      location: 'Austin, TX'
    },
    tags: ['Video', 'Production', 'Marketing', 'Social Media'],
    rating: 4.6,
    reviewCount: 98,
    featured: false
  },
  {
    id: '7',
    title: 'I will provide SEO optimization for your website',
    description: 'Complete SEO audit and optimization service. Includes keyword research, on-page optimization, and performance tracking.',
    category: 'SEO',
    price: 179,
    deliveryTime: '4 days',
    deliveryTimeInDays: 4,
    location: 'Seattle, WA',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '7',
      name: 'Robert Wilson',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 234,
      location: 'Seattle, WA'
    },
    tags: ['SEO', 'Keywords', 'Analytics', 'Optimization'],
    rating: 4.8,
    reviewCount: 187,
    featured: false
  },
  {
    id: '8',
    title: 'I will translate your content to multiple languages',
    description: 'Professional translation services for websites, documents, and marketing materials. Native speakers with industry expertise.',
    category: 'Translation',
    price: 59,
    deliveryTime: '1 day',
    deliveryTimeInDays: 1,
    location: 'Boston, MA',
    images: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '8',
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 312,
      location: 'Boston, MA'
    },
    tags: ['Translation', 'Languages', 'Localization', 'Content'],
    rating: 4.9,
    reviewCount: 278,
    featured: false
  }
];