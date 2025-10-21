import { useState } from 'react';

const StarRating = ({ 
  rating = 0, 
  size = 'md', 
  interactive = false, 
  onRatingChange = null,
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  // Size configurations
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const starSize = sizes[size] || sizes.md;
  const textSize = textSizes[size] || textSizes.md;
  const displayRating = interactive ? (hoverRating || selectedRating) : rating;

  const handleStarClick = (starValue) => {
    if (!interactive) return;
    
    setSelectedRating(starValue);
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!interactive) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const renderStar = (index) => {
    const starValue = index + 1;
    const isFilled = starValue <= displayRating;
    const isHalfFilled = !isFilled && starValue - 0.5 <= displayRating;
    
    return (
      <button
        key={index}
        type="button"
        className={`relative ${starSize} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
        onClick={() => handleStarClick(starValue)}
        onMouseEnter={() => handleStarHover(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={!interactive}
      >
        {/* Background star (empty) */}
        <svg
          className={`absolute inset-0 ${starSize} text-gray-200`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        
        {/* Filled star */}
        {(isFilled || isHalfFilled) && (
          <svg
            className={`absolute inset-0 ${starSize} text-yellow-400 ${isHalfFilled ? 'w-1/2 overflow-hidden' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            style={isHalfFilled ? { clipPath: 'inset(0 50% 0 0)' } : {}}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      
      {showValue && (
        <span className={`ml-2 ${textSize} font-medium text-gray-700`}>
          {displayRating > 0 ? displayRating.toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  );
};

export default StarRating;