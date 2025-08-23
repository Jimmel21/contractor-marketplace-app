import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Star } from 'lucide-react-native';
import { Review } from '@/types/review';
import { useUser } from '@/hooks/user-store';
import { mockServices } from '@/mocks/services';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isTablet = screenWidth >= 768;
const isWeb = Platform.OS === 'web';

// Mock reviews store (in memory)
let mockReviews: Review[] = [];

export default function ReviewsScreen() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams<{
    serviceId: string;
    contractorId?: string;
  }>();
  const { user } = useUser();
  const insets = useSafeAreaInsets();
  
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Find the service details
  const service = mockServices.find((s) => s.id === serviceId);
  const contractor = service?.contractor;

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to leave a review');
      return;
    }

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting');
      return;
    }

    if (comment.trim().length === 0) {
      Alert.alert('Comment Required', 'Please write a comment about your experience');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new review
      const newReview: Review = {
        id: Date.now().toString(),
        serviceId: serviceId || '',
        reviewerId: user.id,
        reviewerName: user.name,
        reviewerAvatar: user.avatar,
        revieweeId: contractor?.id || '',
        revieweeName: contractor?.name || '',
        revieweeAvatar: contractor?.avatar,
        reviewerType: 'client',
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
      };

      // Store in mock reviews array
      mockReviews.push(newReview);

      console.log('Review submitted:', newReview);
      console.log('All reviews:', mockReviews);

      Alert.alert(
        'Review Submitted',
        'Thank you for your feedback! Your review has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            style={styles.starButton}
            testID={`star-${star}`}
          >
            <Star
              size={40}
              color={star <= rating ? '#FFD700' : '#E0E0E0'}
              fill={star <= rating ? '#FFD700' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!service || !contractor) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Leave Review' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Service not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Leave Review' }} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Image source={{ uri: service.images[0] }} style={styles.serviceImage} />
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.contractorName}>by {contractor.name}</Text>
            <Text style={styles.servicePrice}>${service.price}</Text>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <Text style={styles.sectionSubtitle}>Tap the stars to rate</Text>
          {renderStars()}
          {rating > 0 && (
            <Text style={styles.ratingText}>
              {rating} out of 5 stars
            </Text>
          )}
        </View>

        {/* Comment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tell us more</Text>
          <Text style={styles.sectionSubtitle}>
            Share details about your experience with this service
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Write your review here..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
            testID="comment-input"
          />
          <Text style={styles.characterCount}>
            {comment.length}/500 characters
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (rating === 0 || comment.trim().length === 0 || isSubmitting) &&
              styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitReview}
          disabled={rating === 0 || comment.trim().length === 0 || isSubmitting}
          testID="submit-review-button"
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    ...(isWeb && isTablet ? {} : isWeb ? { maxWidth: 480, alignSelf: 'center', width: '100%' } : {}),
  },
  scrollView: {
    flex: 1,
    padding: isSmallScreen ? 16 : (isTablet ? 32 : 20),
  },
  serviceInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  serviceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: isSmallScreen ? 16 : (isTablet ? 22 : 18),
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  contractorName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : (isTablet ? 24 : 20),
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  starButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 120,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallScreen ? 16 : (isTablet ? 32 : 20),
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
};

const styles = StyleSheet.create(baseStyles);