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
import FAQ from './components/FAQ'
import OfferBanner from './components/OfferBanner'
import WhatsAppChat from './components/WhatsAppChat'
import ContactPage from './components/ContactPage'
import PrivacyPolicyPage from './components/PrivacyPolicyPage'
import TermsConditionsPage from './components/TermsConditionsPage'
import ShippingReturnPage from './components/ShippingReturnPage'
import StoriesPage from './components/StoriesPage'
import authService from './services/authService'
import { api } from './services/api'
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

  // FAQ state
  const [showFaq, setShowFaq] = useState(false);
  const [faqs, setFaqs] = useState([]);

  // Load FAQs from API
  const loadFaqs = async () => {
    try {
      const data = await api.get('/api/faqs');
      setFaqs(data);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      // Fallback to sample data if API fails
      setFaqs([
        {
          _id: '1',
          question: 'What makes Janiitra pickles special?',
          answer: 'Our pickles are made using traditional recipes passed down through generations, with authentic spices and natural ingredients. We use no artificial preservatives and follow time-tested methods to ensure the best taste and quality.',
          category: 'General'
        },
        {
          _id: '2',
          question: 'How long do the pickles last?',
          answer: 'Our pickles have a shelf life of 12-18 months when stored properly in a cool, dry place. Once opened, they should be consumed within 2-3 months and kept refrigerated.',
          category: 'Products'
        },
        {
          _id: '3',
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free shipping on orders above ₹500. For orders below ₹500, a nominal shipping charge of ₹50 applies.',
          category: 'Shipping'
        },
        {
          _id: '4',
          question: 'Can I return or exchange products?',
          answer: 'We accept returns within 7 days of delivery if the product is damaged or not as described. Due to the nature of food products, we do not accept returns for change of mind.',
          category: 'Returns'
        },
        {
          _id: '5',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI payments, net banking, and cash on delivery (COD) for most locations.',
          category: 'Payment'
        }
      ]);
    }
  };

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
      } else if (path === '/stories' || searchParams.get('page') === 'stories') {
        setCurrentPage('stories');
      } else if (path === '/contact' || searchParams.get('page') === 'contact') {
        setCurrentPage('contact');
      } else if (path === '/privacy' || searchParams.get('page') === 'privacy') {
        setCurrentPage('privacy');
      } else if (path === '/terms' || searchParams.get('page') === 'terms') {
        setCurrentPage('terms');
      } else if (path === '/shipping' || searchParams.get('page') === 'shipping') {
        setCurrentPage('shipping');
      } else if (path === '/admin' || searchParams.get('page') === 'admin' || searchParams.get('admin') === 'true') {
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
        case 'stories':
          currentURL.searchParams.set('page', 'stories');
          currentURL.searchParams.delete('category');
          break;
        case 'contact':
          currentURL.searchParams.set('page', 'contact');
          currentURL.searchParams.delete('category');
          break;
        case 'privacy':
          currentURL.searchParams.set('page', 'privacy');
          currentURL.searchParams.delete('category');
          break;
        case 'terms':
          currentURL.searchParams.set('page', 'terms');
          currentURL.searchParams.delete('category');
          break;
        case 'shipping':
          currentURL.searchParams.set('page', 'shipping');
          currentURL.searchParams.delete('category');
          break;
        case 'admin':
          currentURL.searchParams.set('page', 'admin');
          currentURL.searchParams.delete('category');
          currentURL.searchParams.delete('admin'); // Remove the admin=true parameter
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

  // Global FAQ function setup
  useEffect(() => {
    window.showFaqModal = () => setShowFaq(true);
    loadFaqs(); // Load FAQs on app start
    return () => {
      delete window.showFaqModal;
    };
  }, []);

  const handleCloseFaq = () => {
    setShowFaq(false);
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

  const navigateToContact = () => {
    setCurrentPage('contact');
  };

  const navigateToPrivacy = () => {
    setCurrentPage('privacy');
  };

  const navigateToTerms = () => {
    setCurrentPage('terms');
  };

  const navigateToShipping = () => {
    setCurrentPage('shipping');
  };

  const navigateToStories = () => {
    setCurrentPage('stories');
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
    window.navigateToContact = navigateToContact;
    window.navigateToPrivacy = navigateToPrivacy;
    window.navigateToTerms = navigateToTerms;
    window.navigateToShipping = navigateToShipping;
    window.navigateToStories = navigateToStories;
    
    return () => {
      delete window.navigateToHome;
      delete window.navigateToProducts;
      delete window.navigateToCart;
      delete window.navigateToWishlist;
      delete window.navigateToCheckout;
      delete window.navigateToAdmin;
      delete window.navigateToProductDetail;
      delete window.navigateToOrderConfirmation;
      delete window.navigateToContact;
      delete window.navigateToPrivacy;
      delete window.navigateToTerms;
      delete window.navigateToShipping;
      delete window.navigateToStories;
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
            onBuyNow={navigateToCheckout}
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
      case 'contact':
        return <ContactPage onNavigateHome={handleBackToHome} onNavigateToProducts={() => navigateToProducts()} />;
      case 'stories':
        return <StoriesPage onBack={handleBackToHome} />;
      case 'privacy':
        return <PrivacyPolicyPage onBack={handleBackToHome} />;
      case 'terms':
        return <TermsConditionsPage onBack={handleBackToHome} />;
      case 'shipping':
        return <ShippingReturnPage onBack={handleBackToHome} />;
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
      {/* Show offer banner on all pages except admin */}
      {currentPage !== 'admin' && currentPage !== 'admin-login' && <OfferBanner />}
      
      {renderPage()}
      
      {/* Show WhatsApp chat on all pages except admin */}
      {currentPage !== 'admin' && currentPage !== 'admin-login' && <WhatsAppChat />}
      
      {/* Customer Authentication Modal */}
      {showCustomerAuth && (
        <CustomerAuth 
          onSuccess={handleCustomerLogin}
          onClose={closeCustomerAuth}
        />
      )}

      {/* FAQ Modal */}
      <FAQ 
        isOpen={showFaq}
        onClose={handleCloseFaq}
        faqs={faqs}
      />
    </div>
  );
}

export default App