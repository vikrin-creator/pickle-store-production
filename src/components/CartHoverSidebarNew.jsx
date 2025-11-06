import { useState, useEffect } from 'react';

const CartHover = ({ isVisible, onClose, cartItems = [] }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isVisible) {
      loadCartItems();
    }
  }, [isVisible]);

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setItems(cartData);
        
        // Calculate total
        const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotal(subtotal);
      } else {
        setItems([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
      setItems([]);
      setTotal(0);
    }
  };

  // Calculate free shipping progress (₹849 target)
  const freeShippingTarget = 849;
  const progressPercentage = Math.min((total / freeShippingTarget) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingTarget - total, 0);

  return (
    <>
      {/* Modern Cart Sidebar */}
      <div 
        className={`fixed top-20 right-0 w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out rounded-l-2xl border border-gray-100 overflow-hidden ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ height: 'calc(100vh - 6rem)' }}
      >
        {/* Close Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 hover:bg-white/20 rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-br from-[#ecab13] via-[#d4941a] to-[#c8841a] text-white py-6 px-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-12 translate-y-12"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87Z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Shopping Cart</h3>
                <p className="text-white/80 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 bg-gradient-to-b from-gray-50/30 to-white" style={{ height: 'calc(100vh - 240px)' }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              {/* Modern Empty Cart Illustration */}
              <div className="mb-8 relative">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-16 h-16 text-[#ecab13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                </div>
                {/* Floating dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ecab13] rounded-full animate-bounce"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-300 rounded-full animate-pulse"></div>
              </div>
              
              <h4 className="text-2xl font-bold mb-3 text-gray-800 bg-gradient-to-r from-[#ecab13] to-[#d4941a] bg-clip-text text-transparent">
                Your cart is empty!
              </h4>
              <p className="text-gray-600 mb-8 px-4 leading-relaxed max-w-sm">
                Discover our amazing pickle collection that will tickle your taste buds with authentic flavors.
              </p>
              
              <button
                onClick={() => {
                  window.navigateToProducts && window.navigateToProducts();
                  onClose();
                }}
                className="bg-gradient-to-r from-[#ecab13] to-[#d4941a] text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-4">
              {items.map((item, index) => (
                <div key={item.cartId || index} className="group bg-white p-3 rounded-lg border border-gray-100 hover:border-[#ecab13]/30 hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center gap-3">
                    {/* Compact Product Image */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex-shrink-0">
                      <img 
                        src={item.image || '/api/placeholder/48/48'} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Compact Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs leading-tight truncate">
                        {item.title}
                      </h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {item.variant}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-bold text-[#ecab13] text-xs">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Compact Total Section */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border-t border-gray-200 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-700">Subtotal:</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-[#ecab13] to-[#d4941a] bg-clip-text text-transparent">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    window.navigateToCart && window.navigateToCart();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-[#ecab13] to-[#d4941a] text-white py-2.5 rounded-lg font-medium hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartHover;