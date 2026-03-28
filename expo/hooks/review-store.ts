import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Review } from '@/types/review';

export const [ReviewProvider, useReviews] = createContextHook(() => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const stored = await AsyncStorage.getItem('reviews');
      if (stored) {
        setReviews(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReviews = async (reviewsToSave: Review[]) => {
    try {
      await AsyncStorage.setItem('reviews', JSON.stringify(reviewsToSave));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  };

  const addReview = useCallback(async (review: Review) => {
    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    await saveReviews(updatedReviews);
    console.log('Review added:', review);
    console.log('All reviews:', updatedReviews);
  }, [reviews]);

  const getReviewsForUser = useCallback((userId: string) => {
    return reviews.filter(review => review.revieweeId === userId);
  }, [reviews]);

  const getReviewsByUser = useCallback((userId: string) => {
    return reviews.filter(review => review.reviewerId === userId);
  }, [reviews]);

  const getUserAverageRating = useCallback((userId: string) => {
    const userReviews = reviews.filter(review => review.revieweeId === userId);
    if (userReviews.length === 0) return 0;
    
    const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / userReviews.length) * 10) / 10;
  }, [reviews]);

  const getUserReviewCount = useCallback((userId: string) => {
    return reviews.filter(review => review.revieweeId === userId).length;
  }, [reviews]);

  return useMemo(() => ({
    reviews,
    isLoading,
    addReview,
    getReviewsForUser,
    getReviewsByUser,
    getUserAverageRating,
    getUserReviewCount,
  }), [reviews, isLoading, addReview, getReviewsForUser, getReviewsByUser, getUserAverageRating, getUserReviewCount]);
});