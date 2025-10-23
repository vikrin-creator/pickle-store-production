import { api } from './api.js';

const API_BASE_URL = 'https://pickle-store-backend.onrender.com/api';

class ReviewService {
  // Get all approved reviews for a specific product
  static async getProductReviews(productId) {
    try {
      return await api.get(`/api/reviews/product/${productId}`);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return {
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
  }

  // Submit a new review (public endpoint)
  static async submitReview(reviewData) {
    try {
      return await api.post('/api/reviews', reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  // Get all public reviews (with pagination)
  static async getAllReviews(limit = 10) {
    try {
      return await api.get(`/api/reviews?limit=${limit}`);
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      return [];
    }
  }

  // Validate review data before submission
  static validateReviewData(reviewData) {
    const errors = [];
    
    if (!reviewData.productId) {
      errors.push('Product ID is required');
    }
    
    if (!reviewData.productName || reviewData.productName.trim().length < 2) {
      errors.push('Product name is required');
    }
    
    if (!reviewData.customerName || reviewData.customerName.trim().length < 2) {
      errors.push('Customer name is required (minimum 2 characters)');
    }
    
    if (reviewData.customerEmail && !this.isValidEmail(reviewData.customerEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      errors.push('Rating must be between 1 and 5 stars');
    }
    
    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
      errors.push('Review comment is required (minimum 10 characters)');
    }
    
    if (reviewData.comment && reviewData.comment.length > 1000) {
      errors.push('Review comment must be less than 1000 characters');
    }
    
    return errors;
  }
  
  // Helper method to validate email
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Format rating for display
  static formatRating(rating) {
    return Math.round(rating * 10) / 10;
  }
  
  // Get rating percentage for progress bars
  static getRatingPercentage(count, total) {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }
  
  // Generate star display string
  static getStarDisplay(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return {
      fullStars,
      hasHalfStar,
      emptyStars,
      rating: this.formatRating(rating)
    };
  }
}

export default ReviewService;