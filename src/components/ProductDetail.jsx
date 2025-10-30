import { useState, useEffect } from 'react';
import Footer from './Footer';
import ReviewSection from './ReviewSection';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import ReviewService from '../services/reviewService';

const ProductDetail = ({ product, onBack, onAddToCart, onNavigateToWishlist, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(
    (product.weightOptions || product.weights) && (product.weightOptions || product.weights).length > 0 
      ? (product.weightOptions || product.weights)[0] 
      : { weight: '250g', price: product.price || 150 }
  );
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [productReviews, setProductReviews] = useState({
    averageRating: 0,
    totalReviews: 0
  });

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = () => {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const wishlist = JSON.parse(savedWishlist);
          const isProductInWishlist = wishlist.some(item => 
            (item._id || item.id) === (product._id || product.id)
          );
          setIsInWishlist(isProductInWishlist);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [product]);

  // Load product reviews
  useEffect(() => {
    const loadProductReviews = async () => {
      if (product._id || product.id) {
        try {
          const reviewData = await ReviewService.getProductReviews(product._id || product.id);
          setProductReviews({
            averageRating: reviewData.averageRating || 0,
            totalReviews: reviewData.totalReviews || 0
          });
        } catch (error) {
          console.error('Error loading product reviews:', error);
        }
      }
    };

    loadProductReviews();
  }, [product]);

  // Define navigation functions
  useEffect(() => {
    window.navigateToHome = () => {
      window.location.href = '/';
    };
    
    window.navigateToProducts = () => {
      window.location.href = '/#products';
    };
    
    window.navigateToStories = () => {
      window.location.href = '/stories';
    };
    
    window.navigateToContact = () => {
      window.location.href = '/contact';
    };
  }, []);

  // Add error handling for missing product
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#221c10] mb-4">Product not found</h2>
          <button
            onClick={onBack}
            className="bg-[#ecab13] text-white px-6 py-3 rounded-lg hover:bg-[#d49c12] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      id: product._id || product.id, // Ensure we use MongoDB _id
      quantity: quantity,
      selectedWeight: selectedWeight,
      price: selectedWeight?.price || 150, // Use the selected weight's price
      cartId: Date.now() // Unique ID for cart item
    });
  };

  const handleBuyNow = () => {
    // Add to cart first
    handleAddToCart();
    // Then navigate to checkout
    if (onBuyNow) {
      onBuyNow();
    } else if (window.navigateToCheckout) {
      window.navigateToCheckout();
    }
  };

  const handleWishlistToggle = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    let wishlist = [];
    
    if (savedWishlist) {
      try {
        wishlist = JSON.parse(savedWishlist);
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        wishlist = [];
      }
    }

    const productId = product._id || product.id;
    const isCurrentlyInWishlist = wishlist.some(item => (item._id || item.id) === productId);

    if (isCurrentlyInWishlist) {
      // Remove from wishlist
      wishlist = wishlist.filter(item => (item._id || item.id) !== productId);
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      wishlist.push(product);
      setIsInWishlist(true);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const getSpiceLevelColor = (level) => {
    switch (level) {
      case 'Mild': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hot': return 'bg-orange-100 text-orange-800';
      case 'Extra Hot': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWriteReview = () => {
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
  };

  const handleReviewSubmitted = (newReview) => {
    // Refresh review data after new review is submitted
    const loadProductReviews = async () => {
      try {
        const reviewData = await ReviewService.getProductReviews(product._id || product.id);
        setProductReviews({
          averageRating: reviewData.averageRating || 0,
          totalReviews: reviewData.totalReviews || 0
        });
      } catch (error) {
        console.error('Error refreshing product reviews:', error);
      }
    };
    
    loadProductReviews();
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/assets/logo.png"
            alt="Janiitra Logo"
            className="h-6 w-36 sm:h-8 sm:w-48 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => window.navigateToHome && window.navigateToHome()}
          />
        </div>

        {/* Navigation - Hidden on mobile, shown on larger screens */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => window.navigateToHome && window.navigateToHome()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Home
          </button>
          <button
            onClick={() => window.navigateToProducts && window.navigateToProducts()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Shop
          </button>
          <button 
            onClick={() => window.navigateToStories && window.navigateToStories()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Stories
          </button>
          <button 
            onClick={() => {
              const aboutSection = document.getElementById('about');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.navigateToHome && window.navigateToHome();
              }
            }}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            About
          </button>
          <button 
            onClick={() => window.navigateToContact && window.navigateToContact()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Contact
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon with Count */}
          <button 
            onClick={() => window.navigateToCart && window.navigateToCart()}
            className="relative flex items-center gap-2 text-white hover:text-[#ecab13] transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H20M7 13l-2.5 5M17 16v6a2 2 0 11-4 0v-6m4 0a2 2 0 104 0m-4 0a2 2 0 10-4 0" />
            </svg>
            {(() => {
              try {
                const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
                return totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ecab13] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                );
              } catch {
                return null;
              }
            })()}
          </button>
          
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-[#ecab13] transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 md:pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image and Reviews */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={product.image || `https://pickle-store-backend.onrender.com/images/${product.imageFilename}` || 'https://via.placeholder.com/600x600/ecab13/FFFFFF?text=' + encodeURIComponent(product.name)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Reviews Section */}
            <ReviewSection 
              productId={product._id || product.id}
              productName={product.name}
              onWriteReview={handleWriteReview}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.category === 'Vegetarian' ? 'bg-green-100 text-green-800' :
                  product.category === 'Non-Vegetarian' ? 'bg-red-100 text-red-800' :
                  product.category === 'Seafood' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.category}
                </span>
                <span className="text-sm text-[#221c10]/60">{product.region || 'India'}</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              
              {/* Product Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <StarRating 
                    rating={productReviews.averageRating} 
                    size="md" 
                    showValue={true}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    ({productReviews.totalReviews} review{productReviews.totalReviews !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              
              <p className="text-lg text-[#221c10]/80 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="border-t border-b border-[#ecab13]/20 py-6">
              <div className="text-3xl font-bold text-[#ecab13]">₹{selectedWeight?.price?.toFixed(2) || '150.00'}</div>
              <p className="text-xs text-[#221c10]/60 mt-1">
                {selectedWeight?.weight || '250g'}
              </p>
            </div>

            {/* Weight/Size Selection */}
            {(product.weights || product.weightOptions) && (product.weights || product.weightOptions).length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#221c10]">
                  Weight & Size
                </label>
                <div className="flex flex-wrap gap-1">
                  {(product.weights || product.weightOptions).map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedWeight(option)}
                      className={`px-2 py-1 rounded text-xs transition-all duration-200 min-w-0 ${
                        selectedWeight?.weight === option.weight
                          ? 'border border-[#ecab13] bg-[#ecab13] text-white'
                          : 'border border-[#ecab13]/30 text-[#221c10] hover:border-[#ecab13]/60'
                      }`}
                    >
                      <div className="font-medium">{option.weight}</div>
                      <div className="opacity-70">₹{option.price?.toFixed(2) || '150.00'}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#221c10]/60">
                  Select your preferred jar size and weight
                </p>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#221c10]">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-[#ecab13]/30 flex items-center justify-center hover:bg-[#ecab13]/10 transition-colors duration-200"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-[#ecab13]/30 flex items-center justify-center hover:bg-[#ecab13]/10 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#ecab13] text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 3H19" />
                </svg>
                Add to Cart - ₹{((selectedWeight?.price || 150) * quantity).toFixed(2)}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleWishlistToggle}
                  className={`py-3 rounded-lg border-2 font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    isInWishlist 
                      ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'border-[#ecab13]/30 text-[#221c10] hover:border-[#ecab13] hover:bg-[#ecab13]/5'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="py-3 rounded-lg border-2 border-[#ecab13] bg-[#ecab13] text-white font-medium hover:bg-[#d49c12] hover:border-[#d49c12] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Buy Now
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 pt-6 border-t border-[#ecab13]/20">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#221c10]/60">Category:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#221c10]/60">Region:</span>
                  <span className="font-medium">{product.region || 'India'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#221c10]/60">Default Spice:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSpiceLevelColor(product.category || 'Medium')}`}>
                    {product.category || 'Medium'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#221c10]/60">Shelf Life:</span>
                  <span className="font-medium">12 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#221c10]/60">Weight:</span>
                  <span className="text-xs font-medium">{selectedWeight?.weight || '250g'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          product={product}
          onClose={handleCloseReviewForm}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;