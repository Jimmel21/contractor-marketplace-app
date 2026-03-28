import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Conversation } from '@/types/message';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';
import { TYPOGRAPHY, SPACING, BORDER_RADIUS, SCREEN_SIZES } from '@/constants/design-system';

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
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: theme.colors.card,
        borderBottomColor: theme.colors.borderLight 
      }]} 
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <Image 
        source={{ uri: otherParticipant?.avatar || 'https://via.placeholder.com/50' }} 
        style={styles.avatar} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {otherParticipant?.name}
          </Text>
          <Text style={[styles.time, { color: theme.colors.textTertiary }]}>
            {formatTime(conversation.lastMessage.timestamp)}
          </Text>
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
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}>
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
    padding: SPACING.lg,
    borderBottomWidth: 1,
  },
  avatar: {
    width: SCREEN_SIZES.isSmall ? 44 : 50,
    height: SCREEN_SIZES.isSmall ? 44 : 50,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    ...TYPOGRAPHY.h4,
  },
  time: {
    ...TYPOGRAPHY.small,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  unreadMessage: {
    ...TYPOGRAPHY.bodyMedium,
  },
  unreadBadge: {
    borderRadius: BORDER_RADIUS.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  unreadCount: {
    color: 'white',
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
});