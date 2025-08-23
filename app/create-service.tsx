import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, DollarSign, Camera, ChevronDown, X, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { categories } from '@/constants/categories';
import { useAuth } from '@/hooks/auth-store';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;
const isWeb = Platform.OS === 'web';

export default function CreateServiceScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const unsplashImages = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop'
  ];

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload photos.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera permissions to take photos.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const newPhotos = result.assets.map(asset => asset.uri);
        setPhotos(prev => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
        if (newPhotos.length > 0) {
          setPhoto(newPhotos[0]); // Set first photo as main
        }
      }
      setShowPhotoModal(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto = result.assets[0].uri;
      setPhotos(prev => [newPhoto, ...prev].slice(0, 5)); // Add to beginning, max 5 photos
      setPhoto(newPhoto);
      setShowPhotoModal(false);
    }
  };

  const removePhoto = (photoToRemove: string) => {
    setPhotos(prev => prev.filter(p => p !== photoToRemove));
    if (photo === photoToRemove) {
      const remainingPhotos = photos.filter(p => p !== photoToRemove);
      setPhoto(remainingPhotos.length > 0 ? remainingPhotos[0] : '');
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!selectedCategory) {
      newErrors.category = 'Category is required';
    }

    if (!price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateService = async () => {
    if (!validateForm()) {
      return;
    }

    if (user?.type !== 'contractor') {
      Alert.alert('Error', 'Only contractors can create services');
      return;
    }

    setIsLoading(true);
    try {
      // Mock service creation - replace with actual API call
      const serviceData = {
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        price: parseFloat(price),
        photo: photo || unsplashImages[0], // Default to first image if none selected
        photos: photos.length > 0 ? photos : [photo || unsplashImages[0]],
        contractorId: user.id,
        createdAt: new Date().toISOString()
      };

      console.log('Creating service:', serviceData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success! 🎉', 
        'Your service has been created successfully and is now live!',
        [
          { 
            text: 'View Services', 
            onPress: () => {
              router.back();
              // Navigate to services or profile
            }
          },
          { 
            text: 'Create Another', 
            onPress: () => {
              setTitle('');
              setDescription('');
              setSelectedCategory('');
              setPrice('');
              setPhoto('');
              setPhotos([]);
              setErrors({});
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating service:', error);
      Alert.alert('Error', 'Failed to create service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return title.trim().length >= 10 && 
           description.trim().length >= 50 && 
           selectedCategory && 
           price.trim() && 
           !isNaN(Number(price)) && 
           Number(price) > 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false
        }} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <LinearGradient
          colors={['#1DBF73', '#17A85C']}
          style={[styles.header, { paddingTop: Math.max(insets.top + 10, 50) }]}
        >
          <TouchableOpacity 
            style={[styles.backButton, { top: Math.max(insets.top + 10, 50) }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Service</Text>
          <Text style={styles.subtitle}>Share your skills with the world</Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Title *</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="e.g., I will design a professional logo"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) {
                    setErrors(prev => ({ ...prev, title: '' }));
                  }
                }}
                placeholderTextColor="#666"
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                placeholder="Describe your service in detail... (minimum 50 characters)"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (errors.description) {
                    setErrors(prev => ({ ...prev, description: '' }));
                  }
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#666"
              />
              <Text style={styles.characterCount}>{description.length}/50 minimum</Text>
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity
                style={[styles.dropdownButton, errors.category && styles.inputError]}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[styles.dropdownText, !selectedCategory && styles.placeholderText]}>
                  {selectedCategory || 'Select a category'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </TouchableOpacity>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price (USD) *</Text>
              <View style={[styles.inputWithIcon, errors.price && styles.inputError]}>
                <DollarSign size={20} color="#666" />
                <TextInput
                  style={styles.inputWithIconText}
                  placeholder="50"
                  value={price}
                  onChangeText={(text) => {
                    setPrice(text);
                    if (errors.price) {
                      setErrors(prev => ({ ...prev, price: '' }));
                    }
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
              </View>
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service Photos</Text>
              <TouchableOpacity
                style={styles.photoUploadButton}
                onPress={() => setShowPhotoModal(true)}
              >
                {photos.length > 0 || photo ? (
                  <View style={styles.photoPreview}>
                    <Image source={{ uri: photo || photos[0] }} style={styles.photoImage} />
                    <View style={styles.photoOverlay}>
                      <Camera size={24} color="white" />
                      <Text style={styles.photoOverlayText}>Manage Photos</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Camera size={32} color="#666" />
                    <Text style={styles.photoPlaceholderText}>Add Service Photos</Text>
                    <Text style={styles.photoPlaceholderSubtext}>Take photos or choose from gallery</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {photos.length > 0 && (
                <ScrollView 
                  horizontal 
                  style={styles.photoThumbnails}
                  showsHorizontalScrollIndicator={false}
                >
                  {photos.map((photoUri, index) => (
                    <View key={index} style={styles.thumbnailContainer}>
                      <Image source={{ uri: photoUri }} style={styles.thumbnail} />
                      <TouchableOpacity
                        style={styles.removeThumbnail}
                        onPress={() => removePhoto(photoUri)}
                      >
                        <X size={16} color="white" />
                      </TouchableOpacity>
                      {photoUri === photo && (
                        <View style={styles.mainPhotoIndicator}>
                          <Text style={styles.mainPhotoText}>Main</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>

            <TouchableOpacity
              style={[styles.createButton, (!isFormValid() || isLoading) && styles.disabledButton]}
              onPress={handleCreateService}
              disabled={!isFormValid() || isLoading}
            >
              <Text style={styles.createButtonText}>
                {isLoading ? 'Creating Service...' : 'Create Service'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.name && styles.categoryItemSelected
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.name);
                    if (errors.category) {
                      setErrors(prev => ({ ...prev, category: '' }));
                    }
                    setShowCategoryModal(false);
                  }}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]} />
                  <Text style={[
                    styles.categoryItemText,
                    selectedCategory === category.name && styles.categoryItemTextSelected
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Photo Selection Modal */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Service Photos</Text>
              <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Photo Action Buttons */}
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoActionButton} onPress={takePhoto}>
                <Camera size={24} color="#1DBF73" />
                <Text style={styles.photoActionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.photoActionButton} onPress={pickImageFromGallery}>
                <ImageIcon size={24} color="#1DBF73" />
                <Text style={styles.photoActionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
            
            {/* Current Photos */}
            {photos.length > 0 && (
              <View style={styles.currentPhotosSection}>
                <Text style={styles.sectionTitle}>Your Photos ({photos.length}/5)</Text>
                <ScrollView horizontal style={styles.currentPhotosScroll} showsHorizontalScrollIndicator={false}>
                  {photos.map((photoUri, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.currentPhotoItem,
                        photo === photoUri && styles.currentPhotoItemSelected
                      ]}
                      onPress={() => setPhoto(photoUri)}
                    >
                      <Image source={{ uri: photoUri }} style={styles.currentPhotoImage} />
                      <TouchableOpacity
                        style={styles.removeCurrentPhoto}
                        onPress={() => removePhoto(photoUri)}
                      >
                        <X size={14} color="white" />
                      </TouchableOpacity>
                      {photoUri === photo && (
                        <View style={styles.currentPhotoSelectedOverlay}>
                          <Text style={styles.currentPhotoSelectedText}>Main</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Stock Photos */}
            <View style={styles.stockPhotosSection}>
              <Text style={styles.sectionTitle}>Stock Photos</Text>
              <ScrollView style={styles.photoGrid} showsVerticalScrollIndicator={false}>
                <View style={styles.photoGridContainer}>
                  {unsplashImages.map((imageUrl, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.photoGridItem,
                        photo === imageUrl && styles.photoGridItemSelected
                      ]}
                      onPress={() => {
                        setPhoto(imageUrl);
                        if (!photos.includes(imageUrl)) {
                          setPhotos(prev => [imageUrl, ...prev].slice(0, 5));
                        }
                        setShowPhotoModal(false);
                      }}
                    >
                      <Image source={{ uri: imageUrl }} style={styles.photoGridImage} />
                      {photo === imageUrl && (
                        <View style={styles.photoSelectedOverlay}>
                          <View style={styles.photoSelectedCheck}>
                            <Text style={styles.photoSelectedCheckText}>✓</Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  header: {
    padding: isSmallScreen ? 16 : (isTablet ? 32 : 20),
    paddingTop: 50,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: isSmallScreen ? 16 : (isTablet ? 32 : 20),
    top: 50,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  categoryButtonActive: {
    borderColor: '#1DBF73',
    backgroundColor: '#1DBF73',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWithIconText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  createButton: {
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
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  dropdownButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  placeholderText: {
    color: '#666',
  },
  photoUploadButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoPreview: {
    position: 'relative',
    height: 200,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  photoPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  photoPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 8,
  },
  photoPlaceholderSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  categoryItemSelected: {
    backgroundColor: '#F0FDF4',
  },
  categoryIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryItemText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  categoryItemTextSelected: {
    color: '#1DBF73',
    fontWeight: '600',
  },
  photoGrid: {
    maxHeight: 400,
  },
  photoGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  photoGridItem: {
    width: '47%',
    aspectRatio: 4/3,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoGridItemSelected: {
    borderWidth: 3,
    borderColor: '#1DBF73',
  },
  photoGridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoSelectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  photoSelectedCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1DBF73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSelectedCheckText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  photoThumbnails: {
    marginTop: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeThumbnail: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainPhotoIndicator: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: 'rgba(29, 191, 115, 0.9)',
    borderRadius: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
  mainPhotoText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  photoActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  photoActionButton: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1DBF73',
  },
  photoActionText: {
    color: '#1DBF73',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  currentPhotosSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stockPhotosSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  currentPhotosScroll: {
    flexDirection: 'row',
  },
  currentPhotoItem: {
    position: 'relative',
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  currentPhotoItemSelected: {
    borderWidth: 2,
    borderColor: '#1DBF73',
  },
  currentPhotoImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  removeCurrentPhoto: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPhotoSelectedOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(29, 191, 115, 0.9)',
    borderRadius: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
  currentPhotoSelectedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
};

const styles = StyleSheet.create(baseStyles);