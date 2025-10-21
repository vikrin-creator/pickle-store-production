import { useState } from 'react';
import StarRating from './StarRating';
import ReviewService from '../services/reviewService';

const ReviewForm = ({ product, onClose, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    rating: 0,
    comment: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare review data
    const reviewData = {
      productId: product._id || product.id,
      productName: product.name,
      customerName: formData.customerName.trim(),
      customerEmail: formData.customerEmail.trim(),
      rating: formData.rating,
      comment: formData.comment.trim()
    };

    // Validate data
    const validationErrors = ReviewService.validateReviewData(reviewData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors([]);
      
      const newReview = await ReviewService.submitReview(reviewData);
      
      setSubmitted(true);
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }
      
      // Auto-close after success message
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      setErrors([error.message || 'Failed to submit review']);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 text-center">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
          <p className="text-gray-600">Thank you for your feedback. Your review will be visible shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Please fix the following errors:</span>
              </div>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Rating *
            </label>
            <div className="flex items-center gap-3">
              <StarRating
                rating={formData.rating}
                size="lg"
                interactive={true}
                onRatingChange={(rating) => handleInputChange('rating', rating)}
              />
              <span className="text-lg font-medium text-gray-700">
                {formData.rating > 0 ? `${formData.rating} star${formData.rating !== 1 ? 's' : ''}` : 'Select a rating'}
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent transition-colors"
              placeholder="Enter your name"
              maxLength={100}
            />
          </div>

          {/* Customer Email */}
          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (optional)
            </label>
            <input
              type="email"
              id="customerEmail"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent transition-colors"
              placeholder="Enter your email (optional)"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Email will not be displayed publicly
            </p>
          </div>

          {/* Review Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent transition-colors resize-none"
              placeholder="Share your thoughts about this product... (minimum 10 characters)"
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum 10 characters</span>
              <span>{formData.comment.length}/1000</span>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be honest and helpful in your review</li>
              <li>• Focus on the product quality and your experience</li>
              <li>• Avoid personal information and inappropriate content</li>
              <li>• Reviews are moderated and may take time to appear</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.rating === 0 || !formData.customerName.trim() || !formData.comment.trim()}
              className="flex-1 px-6 py-3 bg-[#ecab13] text-white rounded-lg font-medium hover:bg-[#d49c12] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;