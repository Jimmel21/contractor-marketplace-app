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
  },
  {
    id: '3',
    participants: [
      {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'current',
        name: 'You'
      }
    ],
    lastMessage: {
      id: '3',
      senderId: '3',
      receiverId: 'current',
      content: 'I\'d love to help with your photography project. When would be a good time to discuss the details?',
      timestamp: '2024-01-13T14:20:00Z',
      read: true
    },
    unreadCount: 0
  },
  {
    id: '4',
    participants: [
      {
        id: '4',
        name: 'David Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'current',
        name: 'You'
      }
    ],
    lastMessage: {
      id: '4',
      senderId: 'current',
      receiverId: '4',
      content: 'Perfect! Let\'s schedule a call for tomorrow at 2 PM.',
      timestamp: '2024-01-12T11:15:00Z',
      read: true
    },
    unreadCount: 0
  },
  {
    id: '5',
    participants: [
      {
        id: '5',
        name: 'Lisa Park',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 'current',
        name: 'You'
      }
    ],
    lastMessage: {
      id: '5',
      senderId: '5',
      receiverId: 'current',
      content: 'Hi! I saw your request for content writing. I have experience in your industry and would love to help.',
      timestamp: '2024-01-11T09:30:00Z',
      read: false
    },
    unreadCount: 1
  }
];