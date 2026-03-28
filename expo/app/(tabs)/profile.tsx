import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Switch,
  Modal,
  TextInput,
  Alert,
  ActionSheetIOS,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Settings, 
  MessageCircle,
  Award,
  Briefcase,
  Edit3,
  X,
  Camera,
  DollarSign,
  ImageIcon,
  Upload,
  Navigation,
  Users,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '@/hooks/auth-store';
import { useReviews } from '@/hooks/review-store';
import { useTheme } from '@/hooks/theme-store';
import { mockServices } from '@/mocks/services';
import ServiceCard from '@/components/ServiceCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;
const isWeb = Platform.OS === 'web';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const { getReviewsForUser, getUserAverageRating, getUserReviewCount } = useReviews();
  const { theme, themeMode, setTheme, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    avatar: ''
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [urlInputVisible, setUrlInputVisible] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<('contractor' | 'client')[]>([]);
  const [selectedActiveRole, setSelectedActiveRole] = useState<'contractor' | 'client'>('client');
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (user) {
      setSelectedRoles(user.availableRoles || [user.type]);
      setSelectedActiveRole(user.type);
    }
  }, [user]);

  const toggleUserType = () => {
    if (user && user.availableRoles && user.availableRoles.length > 1) {
      updateUser({ type: user.type === 'contractor' ? 'client' : 'contractor' });
    }
  };
  
  const canToggleRole = user && user.availableRoles && user.availableRoles.length > 1;

  const openRoleModal = () => {
    if (user) {
      setSelectedRoles(user.availableRoles || [user.type]);
      setSelectedActiveRole(user.type);
    }
    setRoleModalVisible(true);
  };

  const handleRoleToggle = (role: 'contractor' | 'client') => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        // Don't allow removing the last role
        if (prev.length === 1) {
          Alert.alert('Error', 'You must have at least one role selected.');
          return prev;
        }
        const newRoles = prev.filter(r => r !== role);
        // If removing the active role, switch to the remaining one
        if (selectedActiveRole === role && newRoles.length > 0) {
          setSelectedActiveRole(newRoles[0]);
        }
        return newRoles;
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSaveRoles = async () => {
    if (!user || selectedRoles.length === 0) {
      Alert.alert('Error', 'You must have at least one role selected.');
      return;
    }

    // Ensure the active role is in the selected roles
    if (!selectedRoles.includes(selectedActiveRole)) {
      setSelectedActiveRole(selectedRoles[0]);
    }

    const finalActiveRole = selectedRoles.includes(selectedActiveRole) ? selectedActiveRole : selectedRoles[0];

    await updateUser({
      availableRoles: selectedRoles,
      type: finalActiveRole
    });

    setRoleModalVisible(false);
    Alert.alert('Success', 'Your role settings have been updated!');
  };

  const handleLogout = async () => {
    await logout();
  };

  const openEditModal = () => {
    if (user) {
      setEditForm({
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || ''
      });
    }
    setEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    updateUser({
      bio: editForm.bio,
      location: editForm.location,
      avatar: editForm.avatar
    });
    
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera and photo library permissions to upload photos.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImageFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsUploadingPhoto(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          const base64Image = `data:image/jpeg;base64,${asset.base64}`;
          setEditForm(prev => ({ ...prev, avatar: base64Image }));
        } else if (asset.uri) {
          setEditForm(prev => ({ ...prev, avatar: asset.uri }));
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsUploadingPhoto(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.base64) {
          const base64Image = `data:image/jpeg;base64,${asset.base64}`;
          setEditForm(prev => ({ ...prev, avatar: base64Image }));
        } else if (asset.uri) {
          setEditForm(prev => ({ ...prev, avatar: asset.uri }));
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const showPhotoOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library', 'Enter URL'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto();
          } else if (buttonIndex === 2) {
            pickImageFromLibrary();
          } else if (buttonIndex === 3) {
            showUrlInput();
          }
        }
      );
    } else {
      Alert.alert(
        'Select Photo',
        'Choose how you want to add your profile photo',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickImageFromLibrary },
          { text: 'Enter URL', onPress: showUrlInput },
        ]
      );
    }
  };

  const showUrlInput = () => {
    if (Platform.OS === 'web') {
      setUrlInputValue(editForm.avatar);
      setUrlInputVisible(true);
    } else {
      Alert.prompt(
        'Enter Image URL',
        'Please enter the URL of your profile image',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: (url) => {
              if (url && url.trim()) {
                setEditForm(prev => ({ ...prev, avatar: url.trim() }));
              }
            },
          },
        ],
        'plain-text',
        editForm.avatar
      );
    }
  };

  const handleUrlSubmit = () => {
    if (urlInputValue && urlInputValue.trim()) {
      setEditForm(prev => ({ ...prev, avatar: urlInputValue.trim() }));
    }
    setUrlInputVisible(false);
    setUrlInputValue('');
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      setIsGettingLocation(true);
      try {
        if (!navigator.geolocation) {
          Alert.alert('Error', 'Geolocation is not supported by this browser.');
          return;
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Use reverse geocoding to get address
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        
        const location = data.city && data.countryName 
          ? `${data.city}, ${data.countryName}`
          : data.locality || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setEditForm(prev => ({ ...prev, location }));
        Alert.alert('Success', 'Location detected successfully!');
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert(
          'Location Error', 
          'Unable to get your current location. Please enter it manually or check your location permissions.'
        );
      } finally {
        setIsGettingLocation(false);
      }
    } else {
      // Mobile implementation
      setIsGettingLocation(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please grant location permission to use this feature.'
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;
        
        // Reverse geocode to get address
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses.length > 0) {
          const address = addresses[0];
          const locationString = address.city && address.country 
            ? `${address.city}, ${address.country}`
            : address.region || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setEditForm(prev => ({ ...prev, location: locationString }));
          Alert.alert('Success', 'Location detected successfully!');
        } else {
          setEditForm(prev => ({ 
            ...prev, 
            location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
          }));
          Alert.alert('Success', 'Coordinates detected successfully!');
        }
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert(
          'Location Error', 
          'Unable to get your current location. Please enter it manually or check your location permissions.'
        );
      } finally {
        setIsGettingLocation(false);
      }
    }
  };

  const userServices = mockServices.filter(service => 
    user?.type === 'contractor' && service.contractor.id === user.id
  );

  const userReviews = user ? getReviewsForUser(user.id) : [];
  const averageRating = user ? getUserAverageRating(user.id) : 0;
  const reviewCount = user ? getUserReviewCount(user.id) : 0;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Profile' }} />
        <View style={[styles.loadingContainer, { paddingTop: Math.max(insets.top + 10, 50) }]}>
          <ActivityIndicator size="large" color="#1DBF73" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Profile' }} />
        <View style={[styles.errorContainer, { paddingTop: Math.max(insets.top + 10, 50) }]}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Profile' }} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1DBF73', '#17A85C']}
          style={[styles.header, { paddingTop: Math.max(insets.top + 10, 30) }]}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          
          <TouchableOpacity 
            style={styles.editButton}
            onPress={openEditModal}
          >
            <Edit3 size={16} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Star size={20} color="#FFD700" fill="#FFD700" />
              <Text style={styles.statValue}>{averageRating > 0 ? averageRating : user.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.stat}>
              <MessageCircle size={20} color="white" />
              <Text style={styles.statValue}>{reviewCount > 0 ? reviewCount : user.reviewCount}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.stat}>
              <Calendar size={20} color="white" />
              <Text style={styles.statValue}>
                {new Date(user.joinedDate).getFullYear()}
              </Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
          </View>
        </LinearGradient>

        {canToggleRole && (
          <View style={styles.section}>
            <View style={styles.customToggleContainer}>
              <TouchableOpacity 
                style={styles.customToggle}
                onPress={toggleUserType}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.toggleOption,
                  styles.leftToggleOption,
                  user.type === 'client' && styles.activeToggleOption
                ]}>
                  <Text style={[
                    styles.toggleOptionText,
                    user.type === 'client' && styles.activeToggleOptionText
                  ]}>Client</Text>
                </View>
                <View style={[
                  styles.toggleOption,
                  styles.rightToggleOption,
                  user.type === 'contractor' && styles.activeToggleOption
                ]}>
                  <Text style={[
                    styles.toggleOptionText,
                    user.type === 'contractor' && styles.activeToggleOptionText
                  ]}>Contractor</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.bio, { color: theme.colors.text }]}>{user.bio}</Text>
            
            {user.location && (
              <View style={styles.infoRow}>
                <MapPin size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>{user.location}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Calendar size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {user.type === 'contractor' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>My Services</Text>
              <TouchableOpacity 
                style={styles.createServiceButton}
                onPress={() => router.push('/create-service')}
              >
                <Text style={styles.createServiceText}>+ Add Service</Text>
              </TouchableOpacity>
            </View>
            
            {userServices.length > 0 ? (
              <View style={styles.servicesGrid}>
                {userServices.map((service) => (
                  <View key={service.id} style={styles.serviceWrapper}>
                    <ServiceCard service={service} />
                  </View>
                ))}
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.emptyServicesCard, { backgroundColor: theme.colors.card }]}
                onPress={() => router.push('/create-service')}
              >
                <Award size={48} color="#1DBF73" />
                <Text style={[styles.emptyServicesTitle, { color: theme.colors.text }]}>No Services Yet</Text>
                <Text style={[styles.emptyServicesSubtitle, { color: theme.colors.textSecondary }]}>
                  Create your first service to start earning
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Reviews</Text>
          
          {userReviews.length > 0 ? (
            <>
              {/* Reviews Summary */}
              <View style={[styles.reviewsSummary, { backgroundColor: theme.colors.card }]}>
                <View style={styles.ratingOverview}>
                  <View style={styles.averageRatingContainer}>
                    <Text style={[styles.averageRatingNumber, { color: theme.colors.text }]}>{averageRating.toFixed(1)}</Text>
                    <View style={styles.averageRatingStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          color={star <= Math.round(averageRating) ? '#FFD700' : '#E0E0E0'}
                          fill={star <= Math.round(averageRating) ? '#FFD700' : 'transparent'}
                        />
                      ))}
                    </View>
                    <Text style={[styles.reviewCountText, { color: theme.colors.textSecondary }]}>
                      {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                    </Text>
                  </View>
                  
                  <View style={styles.reviewTypeInfo}>
                    <Text style={[styles.reviewTypeText, { color: theme.colors.textTertiary }]}>
                      {user?.type === 'contractor' ? 'Reviews from clients who hired me' : 'Reviews from contractors I hired'}
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* Individual Reviews */}
              <View style={styles.reviewsContainer}>
                {userReviews.slice(0, 5).map((review) => (
                  <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.colors.card }]}>
                    <View style={styles.reviewHeader}>
                      <Image 
                        source={{ uri: review.reviewerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face' }}
                        style={styles.reviewerAvatar}
                      />
                      <View style={styles.reviewerInfo}>
                        <Text style={[styles.reviewerName, { color: theme.colors.text }]}>{review.reviewerName}</Text>
                        <View style={styles.reviewRating}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              color={star <= review.rating ? '#FFD700' : '#E0E0E0'}
                              fill={star <= review.rating ? '#FFD700' : 'transparent'}
                            />
                          ))}
                          <Text style={[styles.reviewDate, { color: theme.colors.textTertiary }]}>
                            {new Date(review.date).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={[styles.reviewComment, { color: theme.colors.textSecondary }]} numberOfLines={4}>
                      {review.comment}
                    </Text>
                  </View>
                ))}
                
                {userReviews.length > 5 && (
                  <TouchableOpacity 
                    style={[styles.viewAllReviewsButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    onPress={() => router.push('/reviews')}
                  >
                    <Text style={[styles.viewAllReviewsText, { color: theme.colors.primary }]}>
                      View all {userReviews.length} reviews
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <View style={[styles.noReviewsCard, { backgroundColor: theme.colors.card }]}>
              <Star size={48} color={theme.colors.border} />
              <Text style={[styles.noReviewsTitle, { color: theme.colors.text }]}>No Reviews Yet</Text>
              <Text style={[styles.noReviewsSubtitle, { color: theme.colors.textSecondary }]}>
                {user?.type === 'contractor' 
                  ? 'Complete your first service to receive reviews from clients'
                  : 'Complete your first job to receive reviews from contractors'
                }
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
            onPress={openRoleModal}
          >
            <Users size={24} color={theme.colors.textSecondary} />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Role Settings</Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                Manage your contractor and client roles
              </Text>
            </View>
          </TouchableOpacity>
          
          {user.type === 'contractor' && (
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
              onPress={() => router.push('/payment-history')}
            >
              <DollarSign size={24} color={theme.colors.textSecondary} />
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Payment History</Text>
                <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                  View your earnings and transaction history
                </Text>
              </View>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
            onPress={() => setThemeModalVisible(true)}
          >
            {themeMode === 'dark' ? (
              <Moon size={24} color={theme.colors.textSecondary} />
            ) : themeMode === 'light' ? (
              <Sun size={24} color={theme.colors.textSecondary} />
            ) : (
              <Monitor size={24} color={theme.colors.textSecondary} />
            )}
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Theme</Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                {themeMode === 'system' ? 'Follow system' : themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.colors.card }]}>
            <Settings size={24} color={theme.colors.textSecondary} />
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Account Settings</Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                Manage your account preferences
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Profile Photo</Text>
              
              <View style={styles.avatarSection}>
                <View style={styles.avatarPreviewContainer}>
                  <Image 
                    source={{ uri: editForm.avatar || user?.avatar }} 
                    style={styles.avatarPreview}
                  />
                  <TouchableOpacity 
                    style={styles.avatarEditButton}
                    onPress={showPhotoOptions}
                    disabled={isUploadingPhoto}
                  >
                    <Camera size={16} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.photoButtons}>
                  <TouchableOpacity 
                    style={[styles.photoButton, styles.primaryPhotoButton]}
                    onPress={showPhotoOptions}
                    disabled={isUploadingPhoto}
                  >
                    <Upload size={16} color="white" />
                    <Text style={styles.photoButtonText}>
                      {isUploadingPhoto ? 'Uploading...' : 'Change Photo'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.photoButton, styles.secondaryPhotoButton]}
                    onPress={showUrlInput}
                    disabled={isUploadingPhoto}
                  >
                    <ImageIcon size={16} color="#1DBF73" />
                    <Text style={styles.secondaryPhotoButtonText}>Use URL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Bio</Text>
              <TextInput
                style={[styles.formInput, styles.bioInput]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                placeholder="Tell others about yourself..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Location</Text>
              <View style={styles.locationInputContainer}>
                <MapPin size={20} color="#666" />
                <TextInput
                  style={styles.formInput}
                  value={editForm.location}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, location: text }))}
                  placeholder="City, State/Country"
                />
                <TouchableOpacity 
                  style={styles.locationButton}
                  onPress={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  <Navigation 
                    size={20} 
                    color={isGettingLocation ? "#ccc" : "#1DBF73"} 
                  />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.useLocationButton, isGettingLocation && styles.useLocationButtonDisabled]}
                onPress={getCurrentLocation}
                disabled={isGettingLocation}
              >
                <Navigation size={16} color={isGettingLocation ? "#ccc" : "#1DBF73"} />
                <Text style={[styles.useLocationButtonText, isGettingLocation && styles.useLocationButtonTextDisabled]}>
                  {isGettingLocation ? 'Getting location...' : 'Use Current Location'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      
      <Modal
        visible={urlInputVisible}
        animationType="fade"
        transparent
      >
        <View style={styles.urlModalOverlay}>
          <View style={styles.urlModalContainer}>
            <Text style={styles.urlModalTitle}>Enter Image URL</Text>
            <Text style={styles.urlModalSubtitle}>
              Please enter the URL of your profile image
            </Text>
            
            <TextInput
              style={styles.urlInput}
              value={urlInputValue}
              onChangeText={setUrlInputValue}
              placeholder="https://example.com/image.jpg"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            
            <View style={styles.urlModalButtons}>
              <TouchableOpacity 
                style={[styles.urlModalButton, styles.urlCancelButton]}
                onPress={() => {
                  setUrlInputVisible(false);
                  setUrlInputValue('');
                }}
              >
                <Text style={styles.urlCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.urlModalButton, styles.urlSubmitButton]}
                onPress={handleUrlSubmit}
              >
                <Text style={styles.urlSubmitButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={roleModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setRoleModalVisible(false)}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Role Settings</Text>
            <TouchableOpacity onPress={handleSaveRoles}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Available Roles</Text>
              <Text style={styles.formSubtitle}>
                Select which roles you want to have access to on the platform
              </Text>
              
              <View style={styles.roleOptions}>
                <TouchableOpacity 
                  style={[
                    styles.roleOption,
                    selectedRoles.includes('client') && styles.roleOptionSelected
                  ]}
                  onPress={() => handleRoleToggle('client')}
                >
                  <View style={styles.roleOptionContent}>
                    <View style={styles.roleOptionHeader}>
                      <Users size={24} color={selectedRoles.includes('client') ? '#1DBF73' : '#666'} />
                      <Text style={[
                        styles.roleOptionTitle,
                        selectedRoles.includes('client') && styles.roleOptionTitleSelected
                      ]}>Client</Text>
                      {selectedRoles.includes('client') && (
                        <Check size={20} color="#1DBF73" />
                      )}
                    </View>
                    <Text style={styles.roleOptionDescription}>
                      Hire contractors and book services
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.roleOption,
                    selectedRoles.includes('contractor') && styles.roleOptionSelected
                  ]}
                  onPress={() => handleRoleToggle('contractor')}
                >
                  <View style={styles.roleOptionContent}>
                    <View style={styles.roleOptionHeader}>
                      <Briefcase size={24} color={selectedRoles.includes('contractor') ? '#1DBF73' : '#666'} />
                      <Text style={[
                        styles.roleOptionTitle,
                        selectedRoles.includes('contractor') && styles.roleOptionTitleSelected
                      ]}>Contractor</Text>
                      {selectedRoles.includes('contractor') && (
                        <Check size={20} color="#1DBF73" />
                      )}
                    </View>
                    <Text style={styles.roleOptionDescription}>
                      Offer services and earn money
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            {selectedRoles.length > 1 && (
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Active Role</Text>
                <Text style={styles.formSubtitle}>
                  Choose which role you want to use by default
                </Text>
                
                <View style={styles.activeRoleOptions}>
                  {selectedRoles.map((role) => (
                    <TouchableOpacity 
                      key={role}
                      style={[
                        styles.activeRoleOption,
                        selectedActiveRole === role && styles.activeRoleOptionSelected
                      ]}
                      onPress={() => setSelectedActiveRole(role)}
                    >
                      <View style={styles.activeRoleRadio}>
                        {selectedActiveRole === role && (
                          <View style={styles.activeRoleRadioSelected} />
                        )}
                      </View>
                      <Text style={[
                        styles.activeRoleText,
                        selectedActiveRole === role && styles.activeRoleTextSelected
                      ]}>
                        {role === 'contractor' ? 'Contractor' : 'Client'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            <View style={styles.roleInfoSection}>
              <Text style={styles.roleInfoTitle}>Role Information</Text>
              <View style={styles.roleInfoCard}>
                <Text style={styles.roleInfoText}>
                  • You can switch between roles anytime from your profile
                </Text>
                <Text style={styles.roleInfoText}>
                  • Each role has different features and capabilities
                </Text>
                <Text style={styles.roleInfoText}>
                  • You must have at least one role selected
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      
      <Modal
        visible={themeModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Theme Settings</Text>
            <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
              <Text style={[styles.saveButton, { color: theme.colors.primary }]}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>Appearance</Text>
              <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
                Choose how the app looks on your device
              </Text>
              
              <View style={styles.themeOptions}>
                <TouchableOpacity 
                  style={[
                    styles.themeOption,
                    { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                    themeMode === 'light' && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }
                  ]}
                  onPress={() => setTheme('light')}
                >
                  <View style={styles.themeOptionContent}>
                    <View style={styles.themeOptionHeader}>
                      <Sun size={24} color={themeMode === 'light' ? theme.colors.primary : theme.colors.textSecondary} />
                      <Text style={[
                        styles.themeOptionTitle,
                        { color: theme.colors.text },
                        themeMode === 'light' && { color: theme.colors.primary }
                      ]}>Light</Text>
                      {themeMode === 'light' && (
                        <Check size={20} color={theme.colors.primary} />
                      )}
                    </View>
                    <Text style={[styles.themeOptionDescription, { color: theme.colors.textSecondary }]}>
                      Clean and bright interface
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.themeOption,
                    { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                    themeMode === 'dark' && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }
                  ]}
                  onPress={() => setTheme('dark')}
                >
                  <View style={styles.themeOptionContent}>
                    <View style={styles.themeOptionHeader}>
                      <Moon size={24} color={themeMode === 'dark' ? theme.colors.primary : theme.colors.textSecondary} />
                      <Text style={[
                        styles.themeOptionTitle,
                        { color: theme.colors.text },
                        themeMode === 'dark' && { color: theme.colors.primary }
                      ]}>Dark</Text>
                      {themeMode === 'dark' && (
                        <Check size={20} color={theme.colors.primary} />
                      )}
                    </View>
                    <Text style={[styles.themeOptionDescription, { color: theme.colors.textSecondary }]}>
                      Easy on the eyes in low light
                    </Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.themeOption,
                    { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                    themeMode === 'system' && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }
                  ]}
                  onPress={() => setTheme('system')}
                >
                  <View style={styles.themeOptionContent}>
                    <View style={styles.themeOptionHeader}>
                      <Monitor size={24} color={themeMode === 'system' ? theme.colors.primary : theme.colors.textSecondary} />
                      <Text style={[
                        styles.themeOptionTitle,
                        { color: theme.colors.text },
                        themeMode === 'system' && { color: theme.colors.primary }
                      ]}>System</Text>
                      {themeMode === 'system' && (
                        <Check size={20} color={theme.colors.primary} />
                      )}
                    </View>
                    <Text style={[styles.themeOptionDescription, { color: theme.colors.textSecondary }]}>
                      Matches your device settings
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.themeInfoSection}>
              <Text style={[styles.themeInfoTitle, { color: theme.colors.text }]}>About Themes</Text>
              <View style={[styles.themeInfoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.themeInfoText, { color: theme.colors.textSecondary }]}>
                  • Light mode provides a clean, bright interface
                </Text>
                <Text style={[styles.themeInfoText, { color: theme.colors.textSecondary }]}>
                  • Dark mode reduces eye strain in low light conditions
                </Text>
                <Text style={[styles.themeInfoText, { color: theme.colors.textSecondary }]}>
                  • System mode automatically follows your device's appearance settings
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    ...(isWeb && isTablet ? {} : isWeb ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : {}),
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: isSmallScreen ? 20 : (isTablet ? 40 : 30),
    paddingTop: 20,
  },
  avatar: {
    width: isSmallScreen ? 80 : (isTablet ? 120 : 100),
    height: isSmallScreen ? 80 : (isTablet ? 120 : 100),
    borderRadius: isSmallScreen ? 40 : (isTablet ? 60 : 50),
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
  },
  name: {
    fontSize: isSmallScreen ? 20 : (isTablet ? 28 : 24),
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: isSmallScreen ? 16 : 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    padding: isSmallScreen ? 16 : (isTablet ? 32 : 20),
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : (isTablet ? 24 : 20),
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  customToggleContainer: {
    alignItems: 'center',
  },
  customToggle: {
    flexDirection: 'row',
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    padding: 4,
    width: isSmallScreen ? 240 : (isTablet ? 320 : 280),
    height: isSmallScreen ? 44 : (isTablet ? 56 : 50),
  },
  toggleOption: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,
    marginHorizontal: 2,
  },
  leftToggleOption: {
    marginLeft: 2,
  },
  rightToggleOption: {
    marginRight: 2,
  },
  activeToggleOption: {
    backgroundColor: 'white',
  },
  toggleOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  activeToggleOptionText: {
    color: '#8B5CF6',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bio: {
    fontSize: 16,
    color: '#1a1a1a',
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionContent: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  createServiceButton: {
    backgroundColor: '#1DBF73',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createServiceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  servicesGrid: {
    gap: 16,
  },
  serviceWrapper: {
    marginBottom: 16,
  },
  emptyServicesCard: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyServicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyServicesSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1DBF73',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  avatarInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationButton: {
    padding: 8,
    marginLeft: 8,
  },
  useLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#1DBF73',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  useLocationButtonDisabled: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  useLocationButtonText: {
    color: '#1DBF73',
    fontSize: 14,
    fontWeight: '600',
  },
  useLocationButtonTextDisabled: {
    color: '#ccc',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarPreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
    borderColor: '#1DBF73',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1DBF73',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  primaryPhotoButton: {
    backgroundColor: '#1DBF73',
  },
  secondaryPhotoButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#1DBF73',
  },
  photoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryPhotoButtonText: {
    color: '#1DBF73',
    fontSize: 14,
    fontWeight: '600',
  },
  urlModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  urlModalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  urlModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  urlModalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  urlInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  urlModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  urlModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  urlCancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  urlSubmitButton: {
    backgroundColor: '#1DBF73',
  },
  urlCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  urlSubmitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: isSmallScreen ? 14 : (isTablet ? 18 : 16),
    color: '#666',
  },
  reviewsContainer: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  viewAllReviewsButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  viewAllReviewsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1DBF73',
  },
  reviewsSummary: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingOverview: {
    alignItems: 'center',
  },
  averageRatingContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  averageRatingNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  averageRatingStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewCountText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  reviewTypeInfo: {
    alignItems: 'center',
  },
  reviewTypeText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  noReviewsCard: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noReviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noReviewsSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  roleOptions: {
    gap: 12,
  },
  roleOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  roleOptionSelected: {
    borderColor: '#1DBF73',
    backgroundColor: '#f8fff9',
  },
  roleOptionContent: {
    flex: 1,
  },
  roleOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  roleOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  roleOptionTitleSelected: {
    color: '#1DBF73',
  },
  roleOptionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  activeRoleOptions: {
    gap: 12,
  },
  activeRoleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeRoleOptionSelected: {
    borderColor: '#1DBF73',
    backgroundColor: '#f8fff9',
  },
  activeRoleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRoleRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1DBF73',
  },
  activeRoleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  activeRoleTextSelected: {
    color: '#1DBF73',
    fontWeight: '600',
  },
  roleInfoSection: {
    marginTop: 24,
  },
  roleInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  roleInfoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  roleInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  themeOptions: {
    gap: 12,
  },
  themeOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  themeOptionContent: {
    flex: 1,
  },
  themeOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  themeOptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  themeOptionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  themeInfoSection: {
    marginTop: 24,
  },
  themeInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  themeInfoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  themeInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
};

const styles = StyleSheet.create(baseStyles);