import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;
const isWeb = Platform.OS === 'web';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error || 'Please try again');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#1DBF73', '#17A85C']}
            style={[styles.header, { paddingTop: Math.max(insets.top + 20, 60) }]}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </LinearGradient>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#666"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Forgot Password', 'Password reset functionality will be implemented soon.')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Loader2 size={20} color="white" style={styles.loadingIcon} />
                  <Text style={styles.loginButtonText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    ...(isWeb && isTablet ? {} : isWeb ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : {}),
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: isSmallScreen ? 24 : (isTablet ? 60 : 40),
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: isSmallScreen ? 28 : (isTablet ? 40 : 32),
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isSmallScreen ? 14 : (isTablet ? 20 : 16),
    color: 'rgba(255, 255, 255, 0.9)',
  },
  form: {
    flex: 1,
    padding: isSmallScreen ? 16 : (isTablet ? 32 : 20),
    paddingTop: isSmallScreen ? 24 : (isTablet ? 60 : 40),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 12 : (isTablet ? 20 : 16),
    paddingVertical: isSmallScreen ? 12 : (isTablet ? 20 : 16),
    marginBottom: isSmallScreen ? 12 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: isSmallScreen ? 8 : 12,
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    color: '#1a1a1a',
  },
  loginButton: {
    backgroundColor: '#1DBF73',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    color: '#1DBF73',
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#1DBF73',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
};

const styles = StyleSheet.create(baseStyles);