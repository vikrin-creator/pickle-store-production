import { useState, useEffect } from 'react';
import CustomerAuth from './CustomerAuth';
import authService from '../services/authService';

const Checkout = ({ onBack, onOrderComplete }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    phone: '',
    
    // Shipping Address
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Special Instructions
    specialInstructions: ''
  });

  useEffect(() => {
    loadCartItems();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'India'
      }));
    } else {
      setShowAuthModal(true);
    }
  };

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        calculateTotal(items);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 2000 ? 0 : 200; // Free shipping over ₹2000, otherwise ₹200
    const tax = subtotal * 0.18; // 18% GST for India
    setTotal(subtotal + shipping + tax);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    // Pre-fill form with user data
    setFormData(prev => ({
      ...prev,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      zipCode: user.address?.zipCode || '',
      country: user.address?.country || 'India'
    }));
  };

  const handleAuthClose = () => {
    if (!authService.isAuthenticated()) {
      // If user closes auth modal without logging in, go back to cart
      onBack();
    } else {
      setShowAuthModal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 2000 ? 0 : 200;
      const tax = subtotal * 0.18;
      const finalTotal = subtotal + shipping + tax;

      // Prepare order data for backend
      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          weight: item.selectedWeight?.weight || '250g',
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.zipCode
          }
        },
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: finalTotal,
        paymentMethod: 'cod', // Cash on Delivery for now
        paymentStatus: 'pending',
        status: 'confirmed'
      };

      // Submit order to backend
      const token = authService.getToken();
      const response = await fetch('https://pickle-store-backend.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const savedOrder = await response.json();

      // Save order to localStorage for reference
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(savedOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart
      localStorage.setItem('cartItems', JSON.stringify([]));
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));

      setIsProcessing(false);
      onOrderComplete(savedOrder);
    } catch (error) {
      console.error('Order creation failed:', error);
      setIsProcessing(false);
      alert('Failed to create order. Please try again.');
    }
  };

  const validateForm = () => {
    const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'cardNumber', 'expiryDate', 'cvv', 'cardName'];
    
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={onBack}
            className="bg-[#ecab13] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700]/90 px-4 sm:px-10 py-4 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/assets/logo.png"
            alt="Janiitra Logo"
            className="h-6 w-36 sm:h-8 sm:w-48 object-contain"
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
          <a href="#" className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]">
            About
          </a>
          <a href="#" className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]">
            Contact
          </a>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-white">Checkout</span>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-[#ecab13] transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Special Instructions (Optional)</h3>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special delivery instructions or notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-[#ecab13]">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 2000 ? 'Free' : '₹200'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST)</span>
                    <span>₹{(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-[#ecab13]">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#ecab13] text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Complete Order
                    </>
                  )}
                </button>

                {/* Security badges */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <CustomerAuth 
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default Checkout;