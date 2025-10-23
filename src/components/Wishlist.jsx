import { useState, useEffect } from 'react';
import Footer from './Footer';

const Wishlist = ({ onBack, onNavigateToCart, onAddToCart }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        setWishlistItems([]);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  const saveWishlistToStorage = (newWishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setWishlistItems(newWishlist);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => (item._id || item.id) !== productId);
    saveWishlistToStorage(updatedWishlist);
  };

  const moveToCart = (product) => {
    // Add to cart
    onAddToCart({
      ...product,
      quantity: 1,
      selectedSpiceLevel: product.spiceLevel || 'Medium',
      selectedWeight: product.weightOptions?.[0] || { weight: '250g', price: product.price || 150 },
      price: product.weightOptions?.[0]?.price || product.price || 150,
      cartId: Date.now()
    });
    
    // Remove from wishlist
    removeFromWishlist(product._id || product.id);
  };

  const clearWishlist = () => {
    saveWishlistToStorage([]);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-white hover:text-[#ecab13] transition-colors duration-200"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white">My Wishlist</h1>
        </div>

        <button 
          onClick={onNavigateToCart}
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-[#ecab13]/20 hover:scale-110"
        >
          <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"></path>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Add products you love to your wishlist and come back to them later!</p>
            <button
              onClick={onBack}
              className="bg-[#ecab13] text-white px-6 py-3 rounded-lg hover:bg-[#d49c12] transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </h2>
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-800 text-sm transition-colors duration-200"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div 
                  key={product._id || product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={product.image || '/assets/placeholder.png'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(product._id || product.id)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-200"
                      title="Remove from wishlist"
                    >
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-[#ecab13]">
                        ₹{product.weightOptions?.[0]?.price?.toFixed(2) || product.price?.toFixed(2) || '150.00'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.weightOptions?.[0]?.weight || '250g'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => moveToCart(product)}
                        className="flex-1 bg-[#ecab13] text-white py-2 px-4 rounded-lg hover:bg-[#d49c12] transition-colors duration-200 text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product._id || product.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;