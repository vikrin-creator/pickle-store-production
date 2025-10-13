import { useState, useEffect } from 'react'
import Homepage from './components/Homepage'
import ProductsPage from './components/ProductsPage'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import AdminPanel from './components/AdminPanel'
import AdminLogin from './components/AdminLogin'
import Wishlist from './components/Wishlist'
import CustomerAuth from './components/CustomerAuth'
import authService from './services/authService'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [productsPageKey, setProductsPageKey] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Customer authentication state
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCustomerAuth, setShowCustomerAuth] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Initialize page from URL on mount
  useEffect(() => {
    const initializeFromURL = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      if (path === '/products' || searchParams.get('page') === 'products') {
        setCurrentPage('products');
        const category = searchParams.get('category');
        if (category) setCategoryFilter(category);
      } else if (path === '/cart' || searchParams.get('page') === 'cart') {
        setCurrentPage('cart');
      } else if (path === '/checkout' || searchParams.get('page') === 'checkout') {
        setCurrentPage('checkout');
      } else if (path === '/admin' || searchParams.get('page') === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };

    initializeFromURL();

    // Listen for browser back/forward button
    const handlePopState = (event) => {
      initializeFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize customer authentication on app start
  useEffect(() => {
    const initializeAuth = () => {
      if (authService.isAuthenticated()) {
        setIsCustomerAuthenticated(true);
        setCurrentUser(authService.getCurrentUser());
      }
    };
    
    initializeAuth();
  }, []);

  // Update URL when page changes
  useEffect(() => {
    const updateURL = () => {
      const currentURL = new URL(window.location);
      
      switch (currentPage) {
        case 'products':
          currentURL.searchParams.set('page', 'products');
          if (categoryFilter !== 'all') {
            currentURL.searchParams.set('category', categoryFilter);
          } else {
            currentURL.searchParams.delete('category');
          }
          break;
        case 'cart':
          currentURL.searchParams.set('page', 'cart');
          currentURL.searchParams.delete('category');
          break;
        case 'checkout':
          currentURL.searchParams.set('page', 'checkout');
          currentURL.searchParams.delete('category');
          break;
        case 'admin':
          currentURL.searchParams.set('page', 'admin');
          currentURL.searchParams.delete('category');
          break;
        case 'home':
        default:
          currentURL.searchParams.delete('page');
          currentURL.searchParams.delete('category');
          break;
      }

      // Only push to history if URL actually changed
      if (currentURL.toString() !== window.location.toString()) {
        window.history.pushState({ page: currentPage }, '', currentURL.toString());
      }
    };

    updateURL();
  }, [currentPage, categoryFilter]);

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
  }, []);

  // Navigation functions
  const navigateToHome = () => {
    setCurrentPage('home');
    setCategoryFilter('all');
  };

  const navigateToProducts = (category = 'all') => {
    setCurrentPage('products');
    setCategoryFilter(category);
    setProductsPageKey(prev => prev + 1);
  };

  const navigateToCart = () => {
    setCurrentPage('cart');
  };

  const navigateToWishlist = () => {
    setCurrentPage('wishlist');
  };

  const navigateToCheckout = () => {
    // Check if user is authenticated before allowing checkout
    if (!isCustomerAuthenticated) {
      setPendingNavigation('checkout');
      setShowCustomerAuth(true);
      return;
    }
    setCurrentPage('checkout');
  };

  const navigateToAdmin = () => {
    setCurrentPage('admin');
  };

  const navigateToProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentPage('productDetail');
  };

  const navigateToOrderConfirmation = (order) => {
    setCurrentOrder(order);
    setCurrentPage('orderConfirmation');
  };

  // Make navigation functions globally available
  useEffect(() => {
    window.navigateToHome = navigateToHome;
    window.navigateToProducts = navigateToProducts;
    window.navigateToCart = navigateToCart;
    window.navigateToWishlist = navigateToWishlist;
    window.navigateToCheckout = navigateToCheckout;
    window.navigateToAdmin = navigateToAdmin;
    window.navigateToProductDetail = navigateToProductDetail;
    window.navigateToOrderConfirmation = navigateToOrderConfirmation;
    
    return () => {
      delete window.navigateToHome;
      delete window.navigateToProducts;
      delete window.navigateToCart;
      delete window.navigateToWishlist;
      delete window.navigateToCheckout;
      delete window.navigateToAdmin;
      delete window.navigateToProductDetail;
      delete window.navigateToOrderConfirmation;
    };
  }, []);

  // Handle URL parameters and keyboard shortcuts after navigation functions are available
  useEffect(() => {
    // Check URL parameter for admin access
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      navigateToAdmin();
    }

    // Add keyboard shortcut for admin access (Ctrl+Shift+A)
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        navigateToAdmin();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateToAdmin]);

  // Customer authentication functions
  const handleCustomerLogin = (user) => {
    setIsCustomerAuthenticated(true);
    setCurrentUser(user);
    setShowCustomerAuth(false);
    
    // If there was a pending navigation (like checkout), proceed with it
    if (pendingNavigation) {
      setCurrentPage(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleCustomerLogout = () => {
    authService.logout();
    setIsCustomerAuthenticated(false);
    setCurrentUser(null);
    // Navigate back to homepage after logout
    setCurrentPage('home');
  };

  const closeCustomerAuth = () => {
    setShowCustomerAuth(false);
    setPendingNavigation(null);
  };

  // Admin authentication functions
  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    // Stay on admin page to show login form
    navigateToAdmin();
  };

  const handleProductClick = (product) => {
    navigateToProductDetail(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    navigateToProducts(categoryFilter);
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setCurrentOrder(null);
    navigateToHome();
  };

  const handleNavigateToCart = () => {
    navigateToCart();
  };

  const handleNavigateToCheckout = () => {
    navigateToCheckout();
  };

  const handleOrderComplete = (order) => {
    navigateToOrderConfirmation(order);
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
            onNavigateToWishlist={navigateToWishlist}
          />
        );
      case 'cart':
        return (
          <Cart 
            onBack={handleBackToProducts} 
            onNavigateToCheckout={handleNavigateToCheckout}
          />
        );
      case 'wishlist':
        return (
          <Wishlist 
            onBack={handleBackToProducts}
            onNavigateToCart={handleNavigateToCart}
            onAddToCart={addToCart}
          />
        );
      case 'checkout':
        return (
          <Checkout 
            onBack={() => setCurrentPage('cart')} 
            onOrderComplete={handleOrderComplete}
            user={currentUser}
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
        return (
          <Homepage 
            cartCount={cartCount} 
            onNavigateToCart={handleNavigateToCart}
            isAuthenticated={isCustomerAuthenticated}
            user={currentUser}
            onLogout={handleCustomerLogout}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
      
      {/* Customer Authentication Modal */}
      {showCustomerAuth && (
        <CustomerAuth 
          onSuccess={handleCustomerLogin}
          onClose={closeCustomerAuth}
        />
      )}
    </div>
  );
}

export default App