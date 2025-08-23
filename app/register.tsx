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
import { User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;
const isWeb = Platform.OS === 'web';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'contractor' | 'client' | 'both'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return name.trim() && 
           email.trim() && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
           phone.trim() &&
           /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, '')) &&
           password.length >= 6 &&
           confirmPassword &&
           password === confirmPassword;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await register({ name, email, phone, password, confirmPassword, userType });
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LinearGradient
            colors={['#1DBF73', '#17A85C']}
            style={[styles.header, { paddingTop: Math.max(insets.top + 20, 40) }]}
          >
            <Text style={styles.title}>Join Us</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </LinearGradient>

          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                <User size={20} color={errors.name ? "#FF6B6B" : "#666"} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    clearError('name');
                  }}
                  placeholderTextColor="#666"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                <Mail size={20} color={errors.email ? "#FF6B6B" : "#666"} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError('email');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                <Phone size={20} color={errors.phone ? "#FF6B6B" : "#666"} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    clearError('phone');
                  }}
                  keyboardType="phone-pad"
                  placeholderTextColor="#666"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                <Lock size={20} color={errors.password ? "#FF6B6B" : "#666"} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={errors.password ? "#FF6B6B" : "#666"} />
                  ) : (
                    <Eye size={20} color={errors.password ? "#FF6B6B" : "#666"} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                <Lock size={20} color={errors.confirmPassword ? "#FF6B6B" : "#666"} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    clearError('confirmPassword');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={errors.confirmPassword ? "#FF6B6B" : "#666"} />
                  ) : (
                    <Eye size={20} color={errors.confirmPassword ? "#FF6B6B" : "#666"} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            <View style={styles.userTypeContainer}>
              <Text style={styles.userTypeLabel}>I am a:</Text>
              <View style={styles.userTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === 'client' && styles.userTypeButtonActive
                  ]}
                  onPress={() => setUserType('client')}
                >
                  <Text style={[
                    styles.userTypeButtonText,
                    userType === 'client' && styles.userTypeButtonTextActive
                  ]}>
                    Client Only
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userTypeButton,
                    userType === 'contractor' && styles.userTypeButtonActive
                  ]}
                  onPress={() => setUserType('contractor')}
                >
                  <Text style={[
                    styles.userTypeButtonText,
                    userType === 'contractor' && styles.userTypeButtonTextActive
                  ]}>
                    Contractor Only
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.userTypeBothButton,
                  userType === 'both' && styles.userTypeBothButtonActive
                ]}
                onPress={() => setUserType('both')}
              >
                <Text style={[
                  styles.userTypeBothButtonText,
                  userType === 'both' && styles.userTypeBothButtonTextActive
                ]}>
                  Both Client & Contractor
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton, 
                (isLoading || !isFormValid()) && styles.disabledButton
              ]}
              onPress={handleRegister}
              disabled={isLoading || !isFormValid()}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Sign In</Text>
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
    paddingTop: 40,
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
    paddingTop: isSmallScreen ? 20 : (isTablet ? 40 : 30),
  },
  fieldContainer: {
    marginBottom: isSmallScreen ? 12 : 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 12 : (isTablet ? 20 : 16),
    paddingVertical: isSmallScreen ? 12 : (isTablet ? 20 : 16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    marginLeft: isSmallScreen ? 8 : 12,
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    color: '#1a1a1a',
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeLabel: {
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 12 : 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  userTypeButtonActive: {
    borderColor: '#1DBF73',
    backgroundColor: '#1DBF73',
  },
  userTypeButtonText: {
    fontSize: isSmallScreen ? 12 : (isTablet ? 16 : 14),
    fontWeight: '600',
    color: '#666',
  },
  userTypeButtonTextActive: {
    color: 'white',
  },
  userTypeBothButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  userTypeBothButtonActive: {
    borderColor: '#1DBF73',
    backgroundColor: '#1DBF73',
  },
  userTypeBothButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  userTypeBothButtonTextActive: {
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#1DBF73',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
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
};

const styles = StyleSheet.create(baseStyles);