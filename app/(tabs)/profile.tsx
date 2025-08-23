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
  Platform
} from 'react-native';
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
  Upload
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/hooks/auth-store';
import { mockServices } from '@/mocks/services';
import ServiceCard from '@/components/ServiceCard';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    avatar: ''
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [urlInputVisible, setUrlInputVisible] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');

  const toggleUserType = () => {
    if (user) {
      updateUser({ type: user.type === 'contractor' ? 'client' : 'contractor' });
    }
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

  const userServices = mockServices.filter(service => 
    user?.type === 'contractor' && service.contractor.id === user.id
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Profile' }} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1DBF73', '#17A85C']}
          style={styles.header}
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
              <Text style={styles.statValue}>{user.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.stat}>
              <MessageCircle size={20} color="white" />
              <Text style={styles.statValue}>{user.reviewCount}</Text>
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

        <View style={styles.section}>
          <View style={styles.userTypeToggle}>
            <View style={styles.toggleInfo}>
              <Briefcase size={20} color="#1a1a1a" />
              <Text style={styles.toggleLabel}>
                I'm a {user.type === 'contractor' ? 'contractor' : 'client'}
              </Text>
            </View>
            <Switch
              value={user.type === 'contractor'}
              onValueChange={toggleUserType}
              trackColor={{ false: '#E0E0E0', true: '#1DBF73' }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Text style={styles.bio}>{user.bio}</Text>
            
            {user.location && (
              <View style={styles.infoRow}>
                <MapPin size={16} color="#666" />
                <Text style={styles.infoText}>{user.location}</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Calendar size={16} color="#666" />
              <Text style={styles.infoText}>
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {user.type === 'contractor' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Services</Text>
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
                style={styles.emptyServicesCard}
                onPress={() => router.push('/create-service')}
              >
                <Award size={48} color="#1DBF73" />
                <Text style={styles.emptyServicesTitle}>No Services Yet</Text>
                <Text style={styles.emptyServicesSubtitle}>
                  Create your first service to start earning
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.actionCard}>
            <Settings size={24} color="#666" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Account Settings</Text>
              <Text style={styles.actionSubtitle}>
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
              </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    paddingTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  userTypeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 12,
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
});