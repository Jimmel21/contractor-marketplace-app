import { Service } from '@/types/service';

export const mockServices: Service[] = [
  {
    id: '1',
    title: 'I will create a modern responsive website for your business',
    description: 'Professional web development service with React, Next.js, and modern design principles. Includes responsive design, SEO optimization, and fast loading times.',
    category: 'Web Development',
    price: 299,
    deliveryTime: '7 days',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 127
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
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 203
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
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      reviewCount: 94
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
    images: [
      'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop'
    ],
    contractor: {
      id: '4',
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 178
    },
    tags: ['Social Media', 'Strategy', 'Growth', 'Content'],
    rating: 4.9,
    reviewCount: 134,
    featured: false
  }
];