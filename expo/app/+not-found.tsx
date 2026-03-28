import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Home, AlertCircle } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ 
        title: "Page Not Found",
        headerStyle: { backgroundColor: '#1DBF73' },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: '600' }
      }} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertCircle size={80} color="#1DBF73" />
        </View>
        
        <Text style={styles.title}>Oops! Page Not Found</Text>
        <Text style={styles.subtitle}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Home size={20} color="white" />
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DBF73',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
