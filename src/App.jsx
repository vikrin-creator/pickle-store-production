import { useState, useEffect } from 'react'
import Homepage from './components/Homepage'
import ProductsPage from './components/ProductsPage'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import AdminPanel from './components/AdminPanel'
import AdminLogin from './components/AdminLogin'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [productsPageKey, setProductsPageKey] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load cart count on component mount
  useEffect(() => {
    updateCartCount();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        const items = JSON.parse(savedCart);
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    }
  };

  const addToCart = (product) => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      // Check if item with same product and spice level already exists
      const existingItemIndex = cartItems.findIndex(
        item => item.id === product.id && item.selectedSpiceLevel === product.selectedSpiceLevel
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        cartItems[existingItemIndex].quantity += product.quantity;
      } else {
        // Add new item
        cartItems.push(product);
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartCount();
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  };

  // Check for admin access via URL parameter or keyboard shortcut
  useEffect(() => {
    // Check if admin is already authenticated
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    // Check if login is still valid (24 hours)
    if (isLoggedIn && loginTime) {
      const timeDiff = Date.now() - parseInt(loginTime);
      const isLoginValid = timeDiff < (24 * 60 * 60 * 1000); // 24 hours
      
      if (isLoginValid) {
        setIsAdminAuthenticated(true);
      } else {
        // Login expired, clear session
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
      }
    }

    // Check URL parameter for admin access
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setCurrentPage('admin');
    }

    // Add keyboard shortcut for admin access (Ctrl+Shift+A)
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setCurrentPage('admin');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Make navigation functions available globally
  window.navigateToProducts = (category = 'all') => {
    setCategoryFilter(category);
    setProductsPageKey(prev => prev + 1); // Force re-render
    setCurrentPage('products');
  };
  window.navigateToHome = () => setCurrentPage('home');
  window.navigateToAdmin = () => setCurrentPage('admin');
  window.navigateToCart = () => setCurrentPage('cart');

  // Admin authentication functions
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    // Stay on admin page to show login form
    setCurrentPage('admin');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('productDetail');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setProductsPageKey(prev => prev + 1); // Force re-render
    setCurrentPage('products');
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setCurrentOrder(null);
    setCurrentPage('home');
  };

  const handleNavigateToCart = () => {
    setCurrentPage('cart');
  };

  const handleNavigateToCheckout = () => {
    setCurrentPage('checkout');
  };

  const handleOrderComplete = (order) => {
    setCurrentOrder(order);
    setCurrentPage('orderConfirmation');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'products':
        return <ProductsPage key={productsPageKey} onProductClick={handleProductClick} cartCount={cartCount} onNavigateToCart={handleNavigateToCart} onAddToCart={addToCart} onNavigateHome={handleBackToHome} categoryFilter={categoryFilter} />;
      case 'productDetail':
        return (
          <ProductDetail 
            product={selectedProduct} 
            onBack={handleBackToProducts} 
            onAddToCart={addToCart}
          />
        );
      case 'cart':
        return (
          <Cart 
            onBack={handleBackToProducts} 
            onNavigateToCheckout={handleNavigateToCheckout}
          />
        );
      case 'checkout':
        return (
          <Checkout 
            onBack={() => setCurrentPage('cart')} 
            onOrderComplete={handleOrderComplete}
          />
        );
      case 'orderConfirmation':
        return (
          <OrderConfirmation 
            order={currentOrder}
            onContinueShopping={handleBackToProducts}
          />
        );
      case 'admin':
        return isAdminAuthenticated ? (
          <AdminPanel onBackToHome={handleBackToHome} onLogout={handleAdminLogout} />
        ) : (
          <AdminLogin onLoginSuccess={handleAdminLogin} />
        );
      case 'home':
      default:
        return <Homepage cartCount={cartCount} onNavigateToCart={handleNavigateToCart} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App