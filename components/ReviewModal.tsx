import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Star, X } from 'lucide-react-native';
import { Review } from '@/types/review';
import { User } from '@/types/user';
import { useReviews } from '@/hooks/review-store';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  reviewee: {
    id: string;
    name: string;
    avatar?: string;
  };
  reviewer: User;
  serviceId?: string;
  onSubmitSuccess?: () => void;
}

export default function ReviewModal({
  visible,
  onClose,
  reviewee,
  reviewer,
  serviceId,
  onSubmitSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addReview } = useReviews();

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
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

      const newReview: Review = {
        id: Date.now().toString(),
        serviceId,
        reviewerId: reviewer.id,
        reviewerName: reviewer.name,
        reviewerAvatar: reviewer.avatar,
        revieweeId: reviewee.id,
        revieweeName: reviewee.name,
        revieweeAvatar: reviewee.avatar,
        reviewerType: reviewer.type,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
      };

      addReview(newReview);

      Alert.alert(
        'Review Submitted',
        'Thank you for your feedback! Your review has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onClose();
              onSubmitSuccess?.();
            },
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

  const resetForm = () => {
    setRating(0);
    setComment('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>Leave Review</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.submitButton,
              (rating === 0 || comment.trim().length === 0 || isSubmitting) &&
                styles.submitButtonDisabled,
            ]}
            disabled={rating === 0 || comment.trim().length === 0 || isSubmitting}
          >
            <Text
              style={[
                styles.submitButtonText,
                (rating === 0 || comment.trim().length === 0 || isSubmitting) &&
                  styles.submitButtonTextDisabled,
              ]}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Reviewee Info */}
          <View style={styles.revieweeInfo}>
            <Image
              source={{
                uri: reviewee.avatar || 'https://via.placeholder.com/60',
              }}
              style={styles.revieweeAvatar}
            />
            <View style={styles.revieweeDetails}>
              <Text style={styles.revieweeName}>{reviewee.name}</Text>
              <Text style={styles.revieweeLabel}>
                {reviewer.type === 'client' ? 'Contractor' : 'Client'}
              </Text>
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
              Share details about your experience
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
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1DBF73',
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  submitButtonTextDisabled: {
    color: '#adb5bd',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  revieweeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
  revieweeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  revieweeDetails: {
    flex: 1,
  },
  revieweeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  revieweeLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
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
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
    minHeight: 120,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});