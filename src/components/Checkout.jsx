import { useState, useEffect } from 'react';
import CustomerAuth from './CustomerAuth';
import authService from '../services/authService';
import ShippingService from '../services/shippingService';
import Footer from './Footer';
import { getDynamicCoupon, validateDynamicCoupon, getExampleCouponText } from '../utils/couponUtils';
import { api } from '../services/api';

const Checkout = ({ onBack, onOrderComplete }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [exampleCouponText, setExampleCouponText] = useState('Loading coupon info...');
  
  // Shipping state
  const [shippingCost, setShippingCost] = useState(200); // Default fallback
  const [shippingInfo, setShippingInfo] = useState(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
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
    paymentMethod: 'cod', // 'cod' or 'online'
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
    loadExampleCouponText();
  }, []);

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

  const loadExampleCouponText = async () => {
    try {
      const text = await getExampleCouponText();
      setExampleCouponText(text);
    } catch (error) {
      console.error('Error loading example coupon text:', error);
      setExampleCouponText('Coupon system temporarily unavailable');
    }
  };

  // Listen for offer banner updates and refresh coupon availability
  useEffect(() => {
    const handleBannerUpdate = async () => {
      // Refresh example coupon text
      await loadExampleCouponText();
      
      // If a coupon is currently applied, check if it's still valid
      if (appliedCoupon) {
        const currentCoupon = await getDynamicCoupon();
        if (!currentCoupon || currentCoupon.code !== appliedCoupon.code) {
          // Current coupon is no longer valid, remove it
          removeCoupon();
          setCouponError('Coupon removed due to offer update');
        }
      }
    };

    // Listen for banner updates
    window.addEventListener('offerBannerUpdate', handleBannerUpdate);
    
    return () => {
      window.removeEventListener('offerBannerUpdate', handleBannerUpdate);
    };
  }, [appliedCoupon]);

  // Calculate shipping when zipCode is available or changes
  useEffect(() => {
    if (formData.zipCode && formData.zipCode.length >= 6) {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      calculateShipping(formData.zipCode, subtotal);
    }
  }, [formData.zipCode, cartItems]);

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

  // Calculate shipping cost dynamically based on pincode and cart total
  const calculateShipping = async (pincode, cartTotal) => {
    if (!pincode || pincode.length < 6) {
      // Use default shipping if no valid pincode
      setShippingCost(200);
      setShippingInfo(null);
      return 200;
    }

    setIsCalculatingShipping(true);
    try {
      const result = await ShippingService.calculateShippingCost(pincode, cartTotal);
      setShippingCost(result.shippingCost);
      setShippingInfo(result);
      return result.shippingCost;
    } catch (error) {
      console.error('Error calculating shipping:', error);
      // Fallback to default shipping on error
      setShippingCost(200);
      setShippingInfo(null);
      return 200;
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const calculateTotal = (items, coupon = appliedCoupon) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply coupon discount to subtotal before tax
    let discountAmount = 0;
    if (coupon) {
      discountAmount = (subtotal * coupon.discount) / 100;
    }
    
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.18; // 18% GST for India
    setTotal(discountedSubtotal + shippingCost + tax);
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Validate against dynamic coupon from offer banner
      const coupon = await validateDynamicCoupon(couponCode);
      
      if (!coupon) {
        const dynamicCoupon = await getDynamicCoupon();
        if (dynamicCoupon) {
          setCouponError(`Invalid coupon code. Current active coupon: ${dynamicCoupon.code}`);
        } else {
          setCouponError('No active coupon available at the moment');
        }
        setIsApplyingCoupon(false);
        return;
      }

      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (subtotal < coupon.minAmount) {
        setCouponError(`Minimum order amount ₹${coupon.minAmount} required for this coupon`);
        setIsApplyingCoupon(false);
        return;
      }

      setAppliedCoupon(coupon);
      calculateTotal(cartItems, coupon);
      setCouponError('');
      
    } catch (error) {
      setCouponError('Error applying coupon. Please try again.');
    }
    
    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    calculateTotal(cartItems, null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate shipping when zipCode changes
    if (name === 'zipCode' && value.length >= 6) {
      calculateShipping(value);
    }
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
      // Calculate totals with coupon
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let discountAmount = 0;
      if (appliedCoupon) {
        discountAmount = (subtotal * appliedCoupon.discount) / 100;
      }
      const discountedSubtotal = subtotal - discountAmount;
      
      // Calculate shipping using API if not already calculated
      let finalShippingCost = shippingCost;
      if (formData.zipCode && shippingCost === 0) {
        try {
          const shippingResult = await calculateShipping(formData.zipCode);
          finalShippingCost = shippingResult;
        } catch (error) {
          console.error('Error calculating shipping during checkout:', error);
          // Fallback to current shipping cost or default
          finalShippingCost = shippingCost || 200;
        }
      }
      
      const tax = discountedSubtotal * 0.18;
      const finalTotal = discountedSubtotal + finalShippingCost + tax;

      // Prepare order data for backend
      const orderData = {
        items: cartItems.map(item => {
          // Generate a valid ObjectId-like string if missing
          const productId = item._id || item.id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          return {
            productId: productId,
            name: item.name || 'Unknown Product',
            weight: item.selectedWeight?.weight || item.weight || '250g',
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || ''
          };
        }),
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
        discount: discountAmount,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discount: appliedCoupon.discount,
          description: appliedCoupon.description
        } : null,
        tax: tax,
        shipping: finalShippingCost,
        total: finalTotal,
        paymentMethod: formData.paymentMethod === 'online' ? 'card' : 'cod', // Map online to card for backend
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'pending',
        status: 'confirmed'
      };

      // Submit order to backend
      const token = authService.getToken();
      let savedOrder;
      
      try {
        savedOrder = await api.post('/api/orders', orderData, {
          'Authorization': `Bearer ${token}`
        });
      } catch (apiError) {
        console.warn('Backend API failed, using fallback mode:', apiError.message);
        
        // Fallback: Create a mock order for testing when backend is down
        savedOrder = {
          _id: `offline_${Date.now()}`,
          orderNumber: `TEST_${Date.now()}`,
          ...orderData,
          status: 'pending_backend',
          createdAt: new Date().toISOString()
        };
        
        // Show warning about offline mode
        alert('⚠️ Backend is currently unavailable. Order saved locally in test mode. Please contact support to confirm your order.');
      }

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
      
      // Show more specific error message
      if (error.message.includes('Backend service unavailable') || error.message.includes('Backend service is busy')) {
        alert('🚧 Backend service is currently unavailable (likely due to high traffic or maintenance). Please wait 15-30 minutes and try again. Your cart will be saved.');
      } else if (error.message.includes('rate limited') || error.message.includes('Server is busy')) {
        alert('🚧 Server is currently busy. Please wait a few minutes and try again. Your cart will be saved.');
      } else if (error.message.includes('timeout')) {
        alert('⏰ Request timed out. The server may be slow. Please try again.');
      } else if (error.message.includes('Authentication failed')) {
        alert('🔒 Authentication error. Please log in again and try.');
      } else if (error.message.includes('Server error')) {
        alert('🔧 Server error. Please try again in a few moments.');
      } else if (error.message.includes('duplicate key')) {
        alert('📝 There was a database issue. Please try placing your order again.');
      } else {
        alert(`❌ Failed to create order: ${error.message}`);
      }
    }
  };

  const validateForm = () => {
    // Base required fields for all orders
    const baseRequiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    
    // Add card fields only if payment method is online
    const requiredFields = formData.paymentMethod === 'online' 
      ? [...baseRequiredFields, 'cardNumber', 'expiryDate', 'cvv', 'cardName']
      : baseRequiredFields;
    
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
    
    // Validate card details only for online payment
    if (formData.paymentMethod === 'online') {
      // Basic card number validation (should be 16 digits)
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        alert('Please enter a valid 16-digit card number');
        return false;
      }
      
      // Basic expiry date validation (MM/YY format)
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        alert('Please enter expiry date in MM/YY format');
        return false;
      }
      
      // Basic CVV validation (3-4 digits)
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        alert('Please enter a valid CVV (3-4 digits)');
        return false;
      }
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
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
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
                
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#ecab13] border-gray-300 focus:ring-[#ecab13]"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">💰</span>
                          <span className="text-sm font-medium text-gray-900">Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-xs text-gray-500">Pay when your order is delivered to your doorstep</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-[#ecab13] border-gray-300 focus:ring-[#ecab13]"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">💳</span>
                          <span className="text-sm font-medium text-gray-900">Online Payment</span>
                        </div>
                        <p className="text-xs text-gray-500">Pay securely using UPI, Credit/Debit Card, Net Banking</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Online Payment Form - Only show when online payment is selected */}
                {formData.paymentMethod === 'online' && (
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
                )}
                
                {/* COD Information - Only show when COD is selected */}
                {formData.paymentMethod === 'cod' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-green-500 text-xl mr-2">✅</span>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Cash on Delivery Selected</h4>
                        <p className="text-xs text-green-600 mt-1">
                          Pay ₹{total.toFixed(2)} in cash when your order is delivered. 
                          Please keep exact change ready for a smooth delivery experience.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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

                {/* Coupon Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Have a coupon?</h4>
                  
                  {!appliedCoupon ? (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ecab13] focus:border-transparent"
                          disabled={isApplyingCoupon}
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-4 py-2 bg-[#ecab13] text-white text-sm font-medium rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isApplyingCoupon ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Applying
                            </>
                          ) : (
                            'Apply'
                          )}
                        </button>
                      </div>
                      
                      {couponError && (
                        <p className="text-red-500 text-xs mt-1">{couponError}</p>
                      )}
                      
                      {/* Current Offer Hint */}
                      <div className="mt-3 text-xs text-gray-600">
                        <p className="font-medium mb-1">Current Offer:</p>
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-yellow-800">{exampleCouponText}</p>
                        </div>
                        <p className="mt-1 text-gray-500">
                          ℹ️ Coupon codes are from the current offer banner
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                      <div>
                        <p className="text-green-800 font-medium text-sm">{appliedCoupon.code}</p>
                        <p className="text-green-600 text-xs">{appliedCoupon.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{((cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * appliedCoupon.discount) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {isCalculatingShipping ? (
                        <span className="text-gray-500">Calculating...</span>
                      ) : shippingCost === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST)</span>
                    <span>₹{(() => {
                      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                      const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
                      const discountedSubtotal = subtotal - discountAmount;
                      return (discountedSubtotal * 0.18).toFixed(2);
                    })()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-[#ecab13]">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Messages */}
                {shippingInfo && (
                  <div className="mb-4">
                    {shippingInfo.isFreeDelivery ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-700 font-medium text-sm text-center">
                          🎉 You've qualified for free shipping!
                        </p>
                        <p className="text-green-600 text-xs text-center mt-1">
                          Delivery Time: {shippingInfo.deliveryTime}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-yellow-700 font-medium text-sm text-center">
                          Add ₹{(shippingInfo.freeDeliveryAbove - cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)} more to get free shipping!
                        </p>
                        <p className="text-yellow-600 text-xs text-center mt-1">
                          Delivery Time: {shippingInfo.deliveryTime} • Zone: {shippingInfo.zone}
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Checkout;