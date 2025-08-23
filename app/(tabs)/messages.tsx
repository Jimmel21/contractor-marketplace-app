import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import ConversationCard from '@/components/ConversationCard';
import { mockConversations } from '@/mocks/conversations';
import { useTheme } from '@/hooks/theme-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;
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
        <View style={[styles.loadingContainer, { paddingTop: Math.max(insets.top + 10, 50), backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color="#1DBF73" />
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
        style={[styles.list, { paddingTop: Math.max(insets.top + 10, 50) }]}
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
    ...(isWeb && isTablet ? {} : isWeb ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : {}),
  },
  list: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 16 : (isTablet ? 32 : 20),
  },
  emptyState: {
    alignItems: 'center',
    padding: isSmallScreen ? 24 : (isTablet ? 60 : 40),
    marginTop: isSmallScreen ? 60 : (isTablet ? 120 : 100),
  },
  emptyTitle: {
    fontSize: isSmallScreen ? 16 : (isTablet ? 22 : 18),
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: isSmallScreen ? 12 : (isTablet ? 16 : 14),
    textAlign: 'center',
    maxWidth: isTablet ? 400 : '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    fontWeight: '500',
  },
};

const styles = StyleSheet.create(baseStyles);