import { useState, useEffect } from 'react';
import authService from '../services/authService';
import HomepageService from '../services/homepageService';
import CategoryService from '../services/categoryService';
import TestimonialService from '../services/testimonialService';
import newsletterService from '../services/newsletterService';
import CustomerAuth from './CustomerAuth';
import CustomerProfile from './CustomerProfile';
import Footer from './Footer';
import CompatibleImage from './CompatibleImage';

const Homepage = ({ cartCount, onNavigateToCart, onNavigateToWishlist, onNavigateToProducts }) => {
  // Hero carousel images
  const heroImages = [
    '/assets/PickleBackgroundjars.png',
    '/assets/PickleBackgroundjars.png', // You can replace these with different images
    '/assets/PickleBackgroundjars.png'  // For now using same image, add more later
  ];

  // Hero carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Helper for category navigation
  const handleCategoryNavigate = (category) => {
    console.log('Homepage: Navigating to category:', category);
    if (onNavigateToProducts) {
      onNavigateToProducts(category);
    } else if (window.navigateToProducts) {
      window.navigateToProducts(category);
    }
  };
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(''); // 'loading', 'success', 'error'
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [homepageData, setHomepageData] = useState({
    featured: { products: [] },
    customerFavorites: { products: [] }
  });
  const [categories, setCategories] = useState([]);
  const [homepageLoading, setHomepageLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Check authentication status on component mount
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    setUser(authService.getCurrentUser());
    loadHomepageData();
    loadCategories();
    loadTestimonials();
    
    // Check if profile should be open from URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('profile') === 'true' && authService.isAuthenticated()) {
      setShowProfile(true);
    }
  }, []);

  // Load categories from database
  const loadCategories = async () => {
    try {
      // Use the SAME API call as Admin Panel for Cloudinary images
      const data = await CategoryService.getAllCategoriesForAdmin();
      console.log('Homepage: Loaded categories from API (same as admin):', data.length);
      setCategories(data || []);
    } catch (error) {
      console.error('Homepage: Error loading categories:', error);
      // Keep static categories as fallback
      setCategories([]);
    }
  };

  // Load testimonials from database
  const loadTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const data = await TestimonialService.getAllTestimonials();
      console.log('Homepage: Loaded testimonials from API:', data.length);
      setTestimonials(data || []);
    } catch (error) {
      console.error('Homepage: Error loading testimonials:', error);
      setTestimonials([]);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentTestimonialIndex(prev => 
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  // Reset testimonial index if out of bounds
  useEffect(() => {
    if (testimonials.length > 0 && currentTestimonialIndex >= testimonials.length) {
      setCurrentTestimonialIndex(0);
    }
  }, [testimonials.length, currentTestimonialIndex]);

  // Load homepage data from API
  const loadHomepageData = async () => {
    try {
      setHomepageLoading(true);

      const sections = await HomepageService.getAllSections();
      const sectionsMap = {};
      if (Array.isArray(sections)) {
        sections.forEach(section => {
          if (section && section.sectionType) {
            sectionsMap[section.sectionType] = section;
          }
        });
      }
      setHomepageData(sectionsMap);
    } catch (error) {
      console.error('Error loading homepage data:', error);
      // Use fallback data
      setHomepageData({
        featured: { title: 'Featured Pickles', products: [] },
        customerFavorites: { title: 'Customer Favorites', products: [] }
      });
    } finally {
      setHomepageLoading(false);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('header') && !event.target.closest('[data-mobile-menu]')) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMobileMenu]);

  const handleLogout = () => {
    authService.clearAuth();
    setIsAuthenticated(false);
    setUser(null);
    // Refresh page or update UI as needed
    window.location.reload();
  };

  const handleProfileClick = () => {
    console.log('Profile clicked, current auth status:', isAuthenticated);
    console.log('Current user:', user);
    console.log('Current showProfile state:', showProfile);
    setShowProfile(true);
    console.log('Profile state set to true');
    
    // Update URL to include profile state
    const url = new URL(window.location);
    url.searchParams.set('profile', 'true');
    window.history.pushState({}, '', url);
  };

  const handleProfileClose = () => {
    setShowProfile(false);
    
    // Remove profile parameter from URL
    const url = new URL(window.location);
    url.searchParams.delete('profile');
    window.history.pushState({}, '', url);
  };

  const handleShowLogin = () => {
    setShowAuthModal(true);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowAuthModal(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionStatus('error');
      setSubscriptionMessage('Please enter your email address');
      return;
    }

    if (!newsletterService.isValidEmail(email)) {
      setSubscriptionStatus('error');
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setSubscriptionStatus('loading');
    setSubscriptionMessage('Subscribing...');

    try {
      const result = await newsletterService.subscribe(email);
      setSubscriptionStatus('success');
      setSubscriptionMessage(result.message || 'Successfully subscribed! Check your email for confirmation.');
      setEmail(''); // Clear email field on success
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('');
        setSubscriptionMessage('');
      }, 5000);
    } catch (error) {
      setSubscriptionStatus('error');
      setSubscriptionMessage(error.message || 'Failed to subscribe. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubscriptionStatus('');
        setSubscriptionMessage('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8f7f6] text-[#221c10] font-body overflow-x-hidden">
      {/* Header */}
      <header className="fixed left-0 right-0 z-40 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
        {/* Logo */}
        <div className="flex items-center animate-fade-in">
          <img 
            src="/assets/logo.png" 
            alt="Janiitra - Authentic Indian Pickles Logo" 
            className="h-6 w-36 sm:h-8 sm:w-48 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => window.navigateToHome && window.navigateToHome()}
          />
        </div>

        {/* Navigation - Hidden on mobile, shown on larger screens */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8 animate-fade-in-delay-1" role="navigation" aria-label="Main navigation">
          <button 
            onClick={() => window.navigateToProducts && window.navigateToProducts()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
            aria-label="Shop for authentic Indian pickles"
          >
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => window.navigateToStories && window.navigateToStories()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
          >
            Stories
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <a href="#about" className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </a>
          <button 
            onClick={() => window.navigateToContact && window.navigateToContact()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Mobile Actions - Cart, Wishlist, Profile, Menu */}
        <div className="lg:hidden flex items-center gap-3 ml-auto relative">
          {/* Wishlist Button */}
          <button 
            onClick={() => window.navigateToWishlist && window.navigateToWishlist()}
            className="text-white hover:text-[#ecab13] transition-colors duration-300"
            aria-label="View wishlist"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Cart Button */}
          <button 
            onClick={() => window.navigateToCart && window.navigateToCart()}
            className="text-white hover:text-[#ecab13] transition-colors duration-300"
            aria-label="View cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L2 21" />
            </svg>
          </button>

          {/* Profile Button */}
          {isAuthenticated ? (
            <button 
              onClick={handleProfileClick}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-[#ecab13]/20 hover:scale-105 group"
              title={`Profile - ${user?.firstName || 'User'}`}
              aria-label="View profile"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">👤</span>
            </button>
          ) : (
            <button 
              onClick={handleShowLogin}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-[#ecab13]/20 hover:scale-105 group"
              title="Login"
              aria-label="Login"
            >
              <svg fill="currentColor" height="18px" viewBox="0 0 256 256" width="18px" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="text-white hover:text-[#ecab13] transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div 
              className="absolute top-full right-0 z-40 bg-white border border-gray-200 shadow-lg rounded-lg mt-2 w-48"
              data-mobile-menu
            >
              <nav className="py-2">
                <button 
                  onClick={() => {
                    window.navigateToProducts && window.navigateToProducts();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
                >
                  Shop
                </button>
                <button 
                  onClick={() => {
                    window.navigateToStories && window.navigateToStories();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
                >
                  Stories
                </button>
                <a 
                  href="#about" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
                  onClick={() => setShowMobileMenu(false)}
                >
                  About
                </a>
                <button 
                  onClick={() => {
                    window.navigateToContact && window.navigateToContact();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
                >
                  Contact
                </button>
                
                {/* Authentication Options in Menu */}
                {isAuthenticated && (
                  <button 
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    🚪 Logout
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="hidden lg:flex items-center gap-2 animate-fade-in-delay-2">
          {/* Account/Profile Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Welcome message - only show on larger screens */}
              <span className="hidden xl:block text-white text-sm">
                Welcome, {user?.firstName || 'Customer'}!
              </span>
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-[#ecab13]/20 hover:scale-105 group"
                title={`Profile - ${user?.firstName || 'User'}`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">👤</span>
                <span className="hidden lg:block text-sm font-medium">Profile</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={handleShowLogin}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-[#ecab13]/20 hover:scale-105 group"
              title="Login"
            >
              <svg fill="currentColor" height="18px" viewBox="0 0 256 256" width="18px" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
              <span className="hidden lg:block text-sm font-medium">Login</span>
            </button>
          )}

          {/* Wishlist Button */}
          <button 
            onClick={() => window.navigateToWishlist && window.navigateToWishlist()}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-[#ecab13]/20 hover:scale-110 group"
            title="View Wishlist"
          >
            <svg fill="none" stroke="currentColor" height="20px" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Cart Button */}
          <button 
            onClick={onNavigateToCart}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 hover:bg-[#ecab13]/20 hover:scale-110 group"
          >
            <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110 transition-transform duration-300">
              <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ecab13] text-xs font-bold text-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main role="main" className="pt-24 md:pt-28">
        {/* Hero Section with Carousel */}
        <section 
          className="relative flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] bg-cover bg-center text-center text-[#e8e1e1] px-3 sm:px-6 py-12 sm:py-16 lg:py-20 animate-fade-in overflow-hidden"
          aria-label="Hero section showcasing authentic Indian pickles"
        >
          {/* Background Images Carousel */}
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url('${image}')`
              }}
            />
          ))}

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-[#ecab13] scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="relative z-10 animate-slide-up max-w-6xl mx-auto -mt-8 sm:-mt-12 lg:-mt-16">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-wide mb-4 text-white animate-fade-in-delay-1">
              AUTHENTIC INDIAN PICKLES
            </h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl lg:max-w-4xl mx-auto leading-relaxed animate-fade-in-delay-2 px-4">
              Handcrafted with love, bursting with traditional flavours that dance
              on your tongue.
            </p>
            <button 
              className="font-body mt-6 sm:mt-8 bg-[#ecab13] text-[#221c10] px-6 sm:px-8 py-2.5 sm:py-3 font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg animate-fade-in-delay-3 transform hover:rotate-1 hover:bg-[#d49811]"
              onClick={() => window.navigateToProducts && window.navigateToProducts()}
              aria-label="Shop authentic Indian pickles now"
            >
              Shop Now
            </button>
          </div>
        </section>

        {/* Our Specialties Section */}
        <section className="py-12 sm:py-16 px-3 sm:px-6 animate-fade-in-up" id="specialties" aria-labelledby="specialties-heading">
          <h2 id="specialties-heading" className="font-display text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-4 animate-slide-down">
            Featured Pickles
          </h2>
          <p className="text-center text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto animate-fade-in-delay-1 px-4">
            Every product carries the richness of Indian kitchens straight to your plate
          </p>
          
          {/* Display categories as featured content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {categories
              .filter(item => item.isActive !== false && item.image) // Only show active categories with images
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => {
                const displayTitle = `${item.emoji || '🥒'} ${item.title}`;
                
                return (
                  <button 
                    key={item._id || index}
                    onClick={() => handleCategoryNavigate(item.category === 'Custom' ? item.title : item.category)}
                    className="h-full flex flex-col rounded-2xl overflow-hidden bg-[#f8f7f6] shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 group text-left animate-fade-in-stagger"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="h-48 sm:h-56 md:h-64 overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2 flex-shrink-0">
                      <CompatibleImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        fallbackSrc="https://via.placeholder.com/400x300/ecab13/FFFFFF?text=Category"
                      />
                    </div>
                    <div className="p-4 sm:p-6 group-hover:bg-[#ecab13]/5 transition-colors duration-300 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold line-clamp-2">{displayTitle}</h3>
                        <p className="mt-2 text-sm sm:text-base text-[#221c10]/70 line-clamp-3">{item.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            
            {/* Show loading message if no categories loaded from API */}
            {categories.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg">
                  🔄 Loading categories from database...
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Fetching categories from MongoDB with Cloudinary images
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Our Promise Section */}
        <section className="py-12 sm:py-16 px-3 sm:px-6 bg-[#ecab13]/10 text-center animate-fade-in-up">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 animate-bounce-in">🌱 Our Promise</h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: "✔", title: "Authenticity First", desc: "Stories rooted in tradition" },
              { icon: "✔", title: "100% Natural", desc: "No preservatives, no artificial flavors" },
              { icon: "✔", title: "Locally Sourced", desc: "Supporting farmers & fishermen" },
              { icon: "✔", title: "Taste of Home", desc: "Packed with nostalgia, purity, and love" }
            ].map((item, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-stagger group cursor-pointer mx-2`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-300 group-hover:text-[#ecab13]">{item.icon}</div>
                <h3 className="font-bold text-base sm:text-lg mb-2 group-hover:text-[#ecab13] transition-colors duration-300">{item.title}</h3>
                <p className="text-sm sm:text-base text-[#221c10]/80">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="max-w-4xl mx-auto mt-6 sm:mt-8 text-base sm:text-lg text-[#221c10]/80 leading-6 sm:leading-7 italic animate-fade-in-delay-2 px-4">
            At Janiitra, food isn't just a product – it's an emotion, a tradition, and a way of life. 
            Every jar of pickle, every pack of spice, and every podi mix carries the richness of Indian kitchens straight to your plate.
          </p>
        </section>

        {/* Traditional Favorites Section */}
        <section className="py-12 sm:py-16 px-3 sm:px-6 animate-fade-in-up">
          <h2 className="font-display text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 animate-slide-down">
            {homepageData.customerFavorites?.title || 'Customer Favorites'}
          </h2>
          
          {/* Loading State */}
          {homepageLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ecab13]"></div>
              <span className="ml-3 text-gray-600">Loading customer favorites...</span>
            </div>
          )}

          {/* Dynamic Customer Favorites */}
          {!homepageLoading && homepageData.customerFavorites?.products?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {homepageData.customerFavorites.products.map((homepageProduct, index) => {
                const product = homepageProduct.productId;
                if (!product || !product._id) {
                  return null; // Skip products with null productId
                }
                return (
                  <div 
                    key={product._id || product.id || index} 
                    className={`relative bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center group hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-stagger mx-2`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div 
                      className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{ backgroundImage: `url('${homepageProduct.customImage || product.image || '/placeholder-pickle.jpg'}')` }}
                    ></div>
                    <div className="mt-3 sm:mt-4 group-hover:transform group-hover:translate-y-1 transition-transform duration-300">
                      <div className="text-base sm:text-lg font-semibold group-hover:text-[#ecab13] transition-colors duration-300">
                        {homepageProduct.customTitle || product.name}
                      </div>
                      <div className="mt-1 text-xs sm:text-sm text-[#221c10]/70 px-1">
                        {homepageProduct.customDescription || product.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fallback to static favorites if no customer favorites */}
          {!homepageLoading && (!homepageData.customerFavorites?.products || homepageData.customerFavorites.products.length === 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: "Mango Pickle",
                  description: "Traditional tangy mango pickle made with organic ingredients and natural oils.",
                  image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009352/pickle-store/MangoTango.png"
                },
                {
                  title: "Mirchi Powder",
                  description: "Pure, aromatic red chili powder to enhance your daily cooking.",
                  image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009338/pickle-store/Chillikick.png"
                },
                {
                  title: "Garlic Pickle",
                  description: "Spicy garlic pickle prepared using age-old stories from grandmothers' kitchens.",
                  image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009343/pickle-store/Garlic.png"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className={`relative bg-white rounded-xl shadow-sm p-3 sm:p-4 text-center group hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-stagger mx-2`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div 
                    className="aspect-square w-full overflow-hidden rounded-xl bg-gray-200 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  ></div>
                  <div className="mt-3 sm:mt-4 group-hover:transform group-hover:translate-y-1 transition-transform duration-300">
                    <div className="text-base sm:text-lg font-semibold group-hover:text-[#ecab13] transition-colors duration-300">{item.title}</div>
                    <div className="mt-1 text-xs sm:text-sm text-[#221c10]/70 px-1">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Customer Testimonials Section - Force Deploy */}
        <section className="py-12 px-3 sm:px-6 bg-gradient-to-br from-[#ecab13]/5 to-[#ecab13]/10 animate-fade-in-up">
          <div className="max-w-5xl mx-auto">
            {/* Section Header - Updated */}
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-4 lowercase">
                what our customers say
              </h2>
            </div>

            {/* Loading State */}
            {testimonialsLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#ecab13]/20 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[#ecab13] rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading authentic reviews...</p>
              </div>
            )}

            {/* Testimonials Carousel */}
            {!testimonialsLoading && testimonials.length > 0 && (
              <div className="relative">
                {/* Navigation Arrows */}
                <button 
                  onClick={() => {
                    if (testimonials && testimonials.length > 1) {
                      setCurrentTestimonialIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
                    }
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                  disabled={!testimonials || testimonials.length <= 1}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button 
                  onClick={() => {
                    if (testimonials && testimonials.length > 1) {
                      setCurrentTestimonialIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
                    }
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-gray-400 hover:text-gray-700 transition-colors duration-200"
                  disabled={!testimonials || testimonials.length <= 1}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Direct Testimonial Display */}
                <div className="max-w-3xl mx-auto px-8 text-center">
                  {testimonials && testimonials.length > 0 && testimonials[currentTestimonialIndex] && (
                    <>
                      {/* Customer Name - Red Color */}
                      <h3 className="text-xl md:text-2xl font-bold text-red-500 mb-2">
                        {testimonials[currentTestimonialIndex].customerName}
                      </h3>
                      
                      {/* Decorative line under name */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent w-24"></div>
                        <div className="mx-2 text-red-300">•</div>
                        <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent w-24"></div>
                      </div>
                      
                      {/* Location and Date */}
                      <p className="text-gray-600 text-sm mb-6">
                        {testimonials[currentTestimonialIndex].customerLocation} | {new Date(testimonials[currentTestimonialIndex].createdAt).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </p>

                      {/* Testimonial Text */}
                      <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed font-normal italic max-w-2xl mx-auto">
                        '{testimonials[currentTestimonialIndex].testimonialText}'
                      </blockquote>
                    </>
                  )}
                </div>

                {/* Simple Dots Navigation */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (testimonials && testimonials.length > 0 && index < testimonials.length) {
                          setCurrentTestimonialIndex(index);
                        }
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentTestimonialIndex 
                          ? 'bg-gray-700' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!testimonialsLoading && testimonials.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🗣️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No testimonials yet</h3>
                <p className="text-gray-500">Be the first to share your experience with our authentic pickles!</p>
              </div>
            )}

            {/* View More Button */}
            {!testimonialsLoading && testimonials.length > 6 && (
              <div className="text-center mt-8">
                <button className="font-body bg-[#ecab13] text-[#221c10] px-6 py-3 font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg transform hover:rotate-1 hover:bg-[#d49811]">
                  View All Reviews
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-[#ecab13]/10 rounded-2xl py-12 sm:py-16 px-3 sm:px-6 text-center mx-3 sm:mx-6 animate-fade-in-up">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold animate-bounce-in">Stay Connected with Janiitra</h2>
          <p className="mt-4 mx-auto max-w-2xl text-base sm:text-lg text-[#221c10]/80 animate-fade-in-delay-1 px-4">
            Get exclusive offers, our authentic story, and product updates straight from our kitchen to your inbox.
          </p>
          
          {/* Status Message */}
          {subscriptionMessage && (
            <div className={`mt-4 mx-auto max-w-96 px-4 py-2 rounded-lg text-sm font-medium ${
              subscriptionStatus === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : subscriptionStatus === 'error'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {subscriptionMessage}
            </div>
          )}

          <form 
            onSubmit={handleNewsletterSubmit}
            className="mt-6 sm:mt-8 mx-auto flex flex-col sm:flex-row max-w-96 gap-2 sm:gap-2 px-4"
          >
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-lg border border-[#ecab13] bg-[#f8f7f6] px-4 py-2.5 sm:py-2 text-[#221c10] text-sm sm:text-base focus:border-[#ecab13] focus:outline-none disabled:opacity-50"
              required
              disabled={subscriptionStatus === 'loading'}
            />
            <button 
              type="submit"
              disabled={subscriptionStatus === 'loading'}
              className="font-body rounded-lg bg-[#ecab13] px-6 py-2.5 sm:py-2 font-semibold text-sm sm:text-base text-[#221c10] transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      {showAuthModal && (
        <CustomerAuth 
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Customer Profile Modal */}
      {showProfile && (
        <CustomerProfile 
          onClose={handleProfileClose}
          onNavigateHome={() => {
            setShowProfile(false);
            // Could add any additional navigation logic here
          }}
          onNavigateToProducts={() => {
            setShowProfile(false);
            onNavigateToProducts && onNavigateToProducts();
          }}
        />
      )}
      
    </div>
  );
};

export default Homepage;