import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import ReviewService from '../services/reviewService';

const ReviewSection = ({ productId, productName, onWriteReview }) => {
  const [reviewData, setReviewData] = useState({
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReviewService.getProductReviews(productId);
      setReviewData(data);
    } catch (err) {
      setError('Failed to load reviews');
      console.error('Error loading reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayedReviews = showAllReviews ? reviewData.reviews : reviewData.reviews.slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
        
        {reviewData.totalReviews > 0 ? (
          <>
            {/* Average Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {ReviewService.formatRating(reviewData.averageRating)}
                </div>
                <StarRating rating={reviewData.averageRating} size="lg" />
                <div className="text-sm text-gray-600 mt-1">
                  {reviewData.totalReviews} review{reviewData.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
              
              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewData.ratingDistribution[star] || 0;
                  const percentage = ReviewService.getRatingPercentage(count, reviewData.totalReviews);
                  
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{star}</span>
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No reviews yet</p>
            <p className="text-gray-500 text-sm">Be the first to review this product!</p>
          </div>
        )}

        {/* Write Review Button */}
        <button
          onClick={onWriteReview}
          className="w-full mt-4 bg-[#ecab13] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#d49c12] transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Write a Review
        </button>
      </div>

      {/* Individual Reviews */}
      {reviewData.reviews.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Recent Reviews ({reviewData.totalReviews})
          </h4>
          
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-[#ecab13] rounded-full flex items-center justify-center text-white font-bold">
                        {review.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{review.customerName}</h5>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                
                {/* Verified Purchase Badge (if available) */}
                {review.verifiedPurchase && (
                  <div className="mt-3 flex items-center gap-1 text-green-600 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Purchase
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {reviewData.reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              {showAllReviews ? 'Show Less' : `Show All ${reviewData.totalReviews} Reviews`}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadReviews}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;