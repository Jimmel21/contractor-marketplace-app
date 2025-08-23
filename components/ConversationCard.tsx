import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Conversation } from '@/types/message';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';

interface ConversationCardProps {
  conversation: Conversation;
}

export default function ConversationCard({ conversation }: ConversationCardProps) {
  const { theme } = useTheme();
  const otherParticipant = conversation.participants.find(p => p.id !== 'current');
  
  const handlePress = () => {
    router.push(`/chat/${conversation.id}`);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.colors.surface }]} onPress={handlePress}>
      <Image 
        source={{ uri: otherParticipant?.avatar || 'https://via.placeholder.com/50' }} 
        style={styles.avatar} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{otherParticipant?.name}</Text>
          <Text style={[styles.time, { color: theme.colors.textSecondary }]}>{formatTime(conversation.lastMessage.timestamp)}</Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage,
              { color: theme.colors.textSecondary },
              !conversation.lastMessage.read && [styles.unreadMessage, { color: theme.colors.text }]
            ]} 
            numberOfLines={1}
          >
            {conversation.lastMessage.senderId === 'current' ? 'You: ' : ''}
            {conversation.lastMessage.content}
          </Text>
          
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#1DBF73',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});