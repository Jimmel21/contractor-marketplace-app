import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import ConversationCard from '@/components/ConversationCard';
import { mockConversations } from '@/mocks/conversations';
import { useTheme } from '@/hooks/theme-store';
import { 
  TYPOGRAPHY, 
  SPACING, 
  SCREEN_SIZES, 
  LAYOUT 
} from '@/constants/design-system';

const isWeb = Platform.OS === 'web';

export default function MessagesScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Stack.Screen options={{ title: 'Messages' }} />
        <View style={[styles.loadingContainer, { paddingTop: Math.max(insets.top + SPACING.md, 50), backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading conversations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Messages' }} />
      
      <FlatList
        data={mockConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationCard conversation={item} />}
        style={[styles.list, { paddingTop: Math.max(insets.top + SPACING.md, 50) }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No messages yet</Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              Start a conversation with a contractor or client
            </Text>
          </View>
        }
      />
    </View>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    ...(isWeb && SCREEN_SIZES.isTablet ? {} : isWeb ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : {}),
  },
  list: {
    flex: 1,
    paddingHorizontal: LAYOUT.containerPadding,
  },
  emptyState: {
    alignItems: 'center',
    padding: SCREEN_SIZES.isTablet ? SPACING.xxxl * 2 : SPACING.xxxl,
    marginTop: SCREEN_SIZES.isTablet ? 120 : 100,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    maxWidth: SCREEN_SIZES.isTablet ? 400 : '100%',
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
};

const styles = StyleSheet.create(baseStyles);