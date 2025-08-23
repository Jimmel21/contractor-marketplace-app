import { Conversation } from '@/types/message';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'current',
        name: 'You'
      }
    ],
    lastMessage: {
      id: '1',
      senderId: '1',
      receiverId: 'current',
      content: 'Thanks for your interest in my web development service! I can definitely help you create a modern website.',
      timestamp: '2024-01-15T10:30:00Z',
      read: false
    },
    unreadCount: 2
  },
  {
    id: '2',
    participants: [
      {
        id: '2',
        name: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'current',
        name: 'You'
      }
    ],
    lastMessage: {
      id: '2',
      senderId: 'current',
      receiverId: '2',
      content: 'Could you show me some examples of your previous logo work?',
      timestamp: '2024-01-14T16:45:00Z',
      read: true
    },
    unreadCount: 0
  }
];