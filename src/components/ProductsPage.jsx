import { useState, useEffect } from 'react';
import Footer from './Footer';
import CategoryService from '../services/categoryService';

const ProductsPage = ({ onProductClick, cartCount, onNavigateToCart, onAddToCart, onNavigateHome, categoryFilter = 'all' }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    diet: '',
    category: categoryFilter === 'all' ? '' : categoryFilter
  });
  const [sortBy, setSortBy] = useState('Popularity');
  const [categories, setCategories] = useState([]);

  // Default products data (fallback if localStorage is empty)
  const defaultProducts = [
    {
      id: 1,
      name: "Mango Tango",
      description: "Traditional mango pickle made with organic ingredients and natural oils - Grandmothers' authentic recipe",
      price: 12.99,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "South Indian",
      image: "/assets/MangoTango.png",
      weightOptions: [
        { weight: '250g', price: 12.99 },
        { weight: '500g', price: 22.99 },
        { weight: '1kg', price: 42.99 }
      ]
    },
    {
      id: 2,
      name: "Lime Zest",
      description: "Pure zesty lime pickle without preservatives - Fresh limes with aromatic traditional spices",
      price: 10.99,
      category: "Vegetarian",
      spiceLevel: "Mild",
      region: "Gujarati",
      image: "/assets/Limezest.png",
      weightOptions: [
        { weight: '200g', price: 10.99 },
        { weight: '400g', price: 19.99 },
        { weight: '800g', price: 37.99 }
      ]
    },
    {
      id: 3,
      name: "Chili Kick",
      description: "Authentic red chili pickle using age-old methods - Pure Mirchi powder, extra hot and flavorful",
      price: 14.99,
      category: "Vegetarian",
      spiceLevel: "Extra Hot",
      region: "North Indian",
      image: "/assets/Chillikick.png",
      weightOptions: [
        { weight: '150g', price: 14.99 },
        { weight: '300g', price: 27.99 },
        { weight: '600g', price: 52.99 }
      ]
    },
    {
      id: 4,
      name: "Garlic Burst",
      description: "Homemade garlic pickle crafted with love - Rich, aromatic, and preservative-free",
      price: 11.99,
      category: "Vegetarian",
      spiceLevel: "Hot",
      region: "Gujarati",
      image: "/assets/Garlic.png",
      weightOptions: [
        { weight: '250g', price: 11.99 },
        { weight: '500g', price: 21.99 },
        { weight: '1kg', price: 40.99 }
      ]
    },
    {
      id: 5,
      name: "Mixed Veggie Medley",
      description: "Traditional seasonal vegetables pickle - No artificial flavors, authentic taste of home",
      price: 13.49,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "North Indian",
      image: "/assets/MixedVegetablePickle.png",
      weightOptions: [
        { weight: '250g', price: 13.49 },
        { weight: '500g', price: 24.99 },
        { weight: '1kg', price: 46.99 }
      ]
    },
    {
      id: 6,
      name: "Authentic Chicken Pickle",
      description: "Traditional non-veg pickle using natural methods - Packed with nostalgia and authentic flavors",
      price: 18.99,
      category: "Non-Vegetarian",
      spiceLevel: "Hot",
      region: "South Indian",
      image: "/assets/chicken.png",
      weightOptions: [
        { weight: '200g', price: 18.99 },
        { weight: '400g', price: 35.99 },
        { weight: '800g', price: 68.99 }
      ]
    },
    {
      id: 7,
      name: "Mirchi Pickle",
      description: "Traditional green chili pickle - Authentic and spicy",
      price: 15.99,
      category: "Vegetarian",
      spiceLevel: "Extra Hot",
      region: "North Indian",
      image: "/assets/Mirchi.png",
      weightOptions: [
        { weight: '200g', price: 15.99 },
        { weight: '400g', price: 29.99 },
        { weight: '800g', price: 56.99 }
      ]
    },
    {
      id: 8,
      name: "Garlic Seed Special",
      description: "Special garlic seed pickle - Unique flavor combination",
      price: 16.99,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "South Indian",
      image: "/assets/GarlicSeed.png",
      weightOptions: [
        { weight: '250g', price: 16.99 },
        { weight: '500g', price: 31.99 },
        { weight: '1kg', price: 59.99 }
      ]
    },
    {
      id: 9,
      name: "Mango Jar Special",
      description: "Premium mango pickle in traditional jar - Family recipe",
      price: 18.99,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "South Indian",
      image: "/assets/MangoJar.png",
      weightOptions: [
        { weight: '250g', price: 18.99 },
        { weight: '500g', price: 35.99 },
        { weight: '1kg', price: 67.99 }
      ]
    },
    {
      id: 10,
      name: "Neem Jar Pickle",
      description: "Traditional neem-infused pickle - Health benefits included",
      price: 20.99,
      category: "Vegetarian",
      spiceLevel: "Mild",
      region: "South Indian",
      image: "/assets/Neemjar.png",
      weightOptions: [
        { weight: '250g', price: 20.99 },
        { weight: '500g', price: 39.99 },
        { weight: '1kg', price: 74.99 }
      ]
    }
  ];

  // Load products from API on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Update filters when categoryFilter prop changes
  useEffect(() => {
    setSelectedFilters(prev => ({
      ...prev,
      category: categoryFilter === 'all' ? '' : categoryFilter
    }));
  }, [categoryFilter]);

  const loadProducts = async () => {
    try {
      console.log('ProductsPage: Loading products from API');
      const response = await fetch('https://pickle-store-backend.onrender.com/api/products');
      if (response.ok) {
        const data = await response.json();
        console.log('ProductsPage: Loaded products from API:', data.length);
        if (data && data.length > 0) {
          console.log('ProductsPage: Sample product structure:', data[0]);
          // Log all product categories for debugging
          const productCategories = data.map(p => ({
            name: p.name,
            category: p.category,
            productCategory: p.productCategory
          }));
          console.log('ProductsPage: All product categories:', productCategories);
        }
        setProducts(data);
      } else {
        console.error('ProductsPage: Failed to load products from API, using defaults');
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.error('ProductsPage: Error loading products from API:', error);
      setProducts(defaultProducts);
    }
  };

  // Load categories from database
  const loadCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      console.log('ProductsPage: Loaded categories from API:', data.length, data);
      if (data && data.length > 0) {
        console.log('ProductsPage: Category structure sample:', data[0]);
      }
      
      console.log('ProductsPage: Final categories list:', (data || []).map(cat => getCategoryValue(cat)));
      setCategories(data || []);
    } catch (error) {
      console.error('ProductsPage: Error loading categories:', error);
      // Fallback to static categories if API fails
      console.log('ProductsPage: Using fallback categories');
      setCategories([
        { category: 'Pickles', emoji: '🥒' },
        { category: 'Spices', emoji: '🌶' },
        { category: 'Podi', emoji: '🍃' },
        { category: 'Seafood', emoji: '🐟' }
      ]);
    }
  };

  // Helper function to get display name for categories
  const getCategoryDisplayName = (category) => {
    // Use title field as the primary display name for all categories
    if (category.title) {
      return category.title;
    }
    // Fallback to old logic for backward compatibility
    return category.category || category.name;
  };

  // Helper function to get category value for filtering
  const getCategoryValue = (category) => {
    // Use title field as the primary value for filtering
    if (category.title) {
      return category.title;
    }
    // Fallback to old logic for backward compatibility
    return category.category || category.name;
  };

  const handleFilterChange = (filterType, value) => {
    console.log('ProductsPage: Filter change -', filterType, ':', value);
    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: prev[filterType] === value ? '' : value
      };
      console.log('ProductsPage: New filters:', newFilters);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      diet: '',
      category: ''
    });
    setSearchQuery('');
    setShowSearch(false);
  };

  // Filter products based on selected filters and search query
  const filteredProducts = products.filter(product => {
    // Search filter - enhanced for better matching
    const searchTerm = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchTerm || (() => {
      // Search in product name
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      // Search in description
      const descriptionMatch = product.description.toLowerCase().includes(searchTerm);
      // Search in category
      const categoryMatch = product.category && product.category.toLowerCase().includes(searchTerm);
      // Search in individual words (for partial matching)
      const nameWords = product.name.toLowerCase().split(' ');
      const wordMatch = nameWords.some(word => word.startsWith(searchTerm));
      
      return nameMatch || descriptionMatch || categoryMatch || wordMatch;
    })();
    
    // Dietary filter
    const matchesDiet = !selectedFilters.diet || product.category === selectedFilters.diet;
    
    // Category filter - match products to selected category
    const matchesCategory = !selectedFilters.category || (() => {
      const selectedCategory = selectedFilters.category;
      
      // Debug logging
      console.log('ProductsPage Filter Debug:', {
        productName: product.name,
        productCategory: product.productCategory,
        productDietaryCategory: product.category,
        selectedCategory: selectedCategory,
        productObject: product
      });
      
      // For products with new structure (has productCategory field)
      if (product.productCategory) {
        const matches = product.productCategory === selectedCategory;
        console.log(`Product ${product.name}: productCategory="${product.productCategory}" matches selectedCategory="${selectedCategory}": ${matches}`);
        return matches;
      }
      
      // For old products without productCategory, map based on original logic
      let matches = false;
      switch (selectedCategory) {
        case 'Pickles':
          matches = product.category === 'Vegetarian' || product.category === 'Non-Vegetarian';
          break;
        case 'Seafood':
          matches = product.category === 'Seafood';
          break;
        case 'Podi':
          matches = product.category === "Podi's" || product.category === 'Podi';
          break;
        case 'Spices':
          matches = product.category === 'Spices';
          break;
        default:
          // For any custom categories, try to match against category field
          matches = product.category === selectedCategory;
      }
      
      console.log(`Product ${product.name}: old structure matches selectedCategory="${selectedCategory}": ${matches} (category="${product.category}")`);
      return matches;
    })();
    
    return matchesSearch && matchesDiet && matchesCategory;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        const priceA = a.price || a.weightOptions?.[0]?.price || 0;
        const priceB = b.price || b.weightOptions?.[0]?.price || 0;
        return priceA - priceB;
      case 'Price: High to Low':
        const priceHighA = a.price || a.weightOptions?.[0]?.price || 0;
        const priceHighB = b.price || b.weightOptions?.[0]?.price || 0;
        return priceHighB - priceHighA;
      case 'Newest':
        return (b._id || b.id || 0) - (a._id || a.id || 0); // Assuming higher ID means newer
      case 'Popularity':
      default:
        return 0; // Keep original order for popularity
    }
  });

  return (
    <div className="products-page min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700]/90 px-4 sm:px-10 py-4 backdrop-blur-sm">
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
            onClick={() => onNavigateHome && onNavigateHome()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Home
          </button>
          <button className="text-base font-medium text-[#ecab13]">
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
          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors duration-200 ${
              showMobileFilters ? 'bg-[#ecab13]' : 'bg-white/20 hover:bg-[#ecab13]/20'
            }`}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>

          {/* Search Button */}
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors duration-200 ${
              showSearch ? 'bg-[#ecab13]' : 'bg-white/20 hover:bg-[#ecab13]/20'
            }`}
          >
            <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={() => window.navigateToWishlist && window.navigateToWishlist()}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-200 hover:bg-[#ecab13]/20"
            title="View Wishlist"
          >
            <svg fill="none" stroke="currentColor" height="20px" viewBox="0 0 24 24" width="20px" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Cart Button */}
          <button 
            onClick={onNavigateToCart}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white transition-colors duration-200 hover:bg-[#ecab13]/20"
          >
            <svg fill="currentColor" height="20px" viewBox="0 0 256 256" width="20px" xmlns="http://www.w3.org/2000/svg">
              <path d="M222.14,58.87A8,8,0,0,0,216,56H54.68L49.79,29.14A16,16,0,0,0,34.05,16H16a8,8,0,0,0,0,16h18L59.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,152,204a28,28,0,1,0,28-28H83.17a8,8,0,0,1-7.87-6.57L72.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,222.14,58.87ZM96,204a12,12,0,1,1-12-12A12,12,0,0,1,96,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,192,204Zm4-74.57A8,8,0,0,1,188.1,136H69.22L57.59,72H206.41Z"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ecab13] text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-10 py-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pickles... (e.g., mango, chili, lime)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13] focus:border-[#ecab13]"
                autoFocus
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Searching for: <span className="font-semibold">"{searchQuery}"</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileFilters(false)}>
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl z-50" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#221c10]">Filters</h2>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-full pb-20">
              {/* Category Filter */}
              <div className="filter-group mb-6">
                <h3 className="filter-label text-base font-semibold mb-3 text-[#221c10]">Category</h3>
                <div className="filter-options space-y-2">
                  {categories.map((category) => (
                    <label key={getCategoryValue(category)} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="category-mobile" 
                        checked={selectedFilters.category === getCategoryValue(category)}
                        onChange={() => handleFilterChange('category', getCategoryValue(category))}
                        className="mr-3 text-[#ecab13] focus:ring-[#ecab13]"
                      />
                      <span className="text-gray-700">{category.emoji} {getCategoryDisplayName(category)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dietary Filter */}
              <div className="filter-group mb-6">
                <h3 className="filter-label text-base font-semibold mb-3 text-[#221c10]">Dietary</h3>
                <div className="filter-options space-y-2">
                  {['Vegetarian', 'Non-Vegetarian'].map((diet) => (
                    <label key={diet} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="diet-mobile" 
                        checked={selectedFilters.diet === diet}
                        onChange={() => handleFilterChange('diet', diet)}
                        className="mr-3 text-[#ecab13] focus:ring-[#ecab13]"
                      />
                      <span className="text-gray-700">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                <div className="flex gap-3">
                  <button 
                    onClick={clearAllFilters}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 bg-[#ecab13] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#d49c12] transition-colors duration-200"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="products-main">
        <div className="products-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:flex lg:align-start">
            {/* Sidebar Filters - Desktop */}
            <aside className="products-filters sticky top-28 z-5 hidden lg:block">
              <div className="filters-container w-64 bg-white rounded-lg shadow-md p-6 mr-6">
                <h2 className="filters-title text-xl font-bold mb-6 text-[#221c10]">Filters</h2>
              
              {/* Category Filter */}
              <div className="filter-group mb-6">
                <h3 className="filter-label text-lg font-semibold mb-3 text-[#221c10]">Category</h3>
                <div className="filter-options space-y-2">
                  {categories.map((category) => (
                    <label key={getCategoryValue(category)} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={selectedFilters.category === getCategoryValue(category)}
                        onChange={() => handleFilterChange('category', getCategoryValue(category))}
                        className="mr-3 text-[#ecab13] focus:ring-[#ecab13]"
                      />
                      <span className="text-gray-700">{category.emoji} {getCategoryDisplayName(category)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dietary Filter */}
              <div className="filter-group mb-6">
                <h3 className="filter-label text-lg font-semibold mb-3 text-[#221c10]">Dietary</h3>
                <div className="filter-options space-y-2">
                  {['Vegetarian', 'Non-Vegetarian'].map((diet) => (
                    <label key={diet} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="diet" 
                        checked={selectedFilters.diet === diet}
                        onChange={() => handleFilterChange('diet', diet)}
                        className="mr-3 text-[#ecab13] focus:ring-[#ecab13]"
                      />
                      <span className="text-gray-700">{diet}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={clearAllFilters}
                className="apply-filters-btn w-full bg-[#ecab13] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#d49c12] transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products Section */}
          <section className="products-list-section flex-1">
            {/* Products Header */}
            <div className="products-list-header flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <div>
                <h1 className="products-list-title text-2xl sm:text-3xl font-bold text-[#221c10]">Shop All Pickles</h1>
                <p className="text-gray-600 mt-1">
                  {searchQuery ? (
                    <>Showing {sortedProducts.length} result{sortedProducts.length !== 1 ? 's' : ''} for "<span className="font-semibold">{searchQuery}</span>"</>
                  ) : (
                    <>Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}</>
                  )}
                </p>
              </div>
              <div className="products-sort flex items-center gap-2">
                <span className="text-gray-700 text-sm sm:text-base">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13] text-sm sm:text-base"
                >
                  <option value="Popularity">Popularity</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((product) => (
                  <div 
                    key={product._id || product.id} 
                    className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative cursor-pointer"
                    onClick={() => onProductClick && onProductClick(product)}
                  >
                    <div className="product-image-wrapper relative">
                      <img
                        src={product.image ? (product.image.startsWith('/api/') ? `https://pickle-store-backend.onrender.com${product.image}` : product.image) : "https://via.placeholder.com/300x200"}
                        alt={product.name}
                        className="w-full h-36 sm:h-40 md:h-48 object-cover"
                        onError={(e) => {
                          console.log('ProductsPage: Image failed to load:', product.image);
                          e.target.src = "https://via.placeholder.com/300x200";
                        }}
                      />
                      <div className="product-favorite absolute top-1 sm:top-2 right-1 sm:right-2 p-1 sm:p-2 bg-white/80 rounded-full cursor-pointer hover:bg-white transition-colors duration-200">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-[#ecab13]"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </div>
                    </div>
                    <div className="product-details p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-[#221c10] line-clamp-1">{product.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{product.description}</p>
                      
                      <div className="product-actions flex justify-between items-center">
                        <span className="product-price text-[#ecab13] font-bold text-sm sm:text-lg md:text-xl">
                          {(product.weightOptions?.length > 0 || product.weights?.length > 0)
                            ? `₹${Math.min(...(product.weightOptions || product.weights).map(opt => opt.price))}` 
                            : `₹${product.price || 'N/A'}`
                          }
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onProductClick && onProductClick(product);
                          }}
                          className="add-btn bg-[#ecab13] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold hover:bg-[#d49c12] transition-colors duration-200 text-xs sm:text-sm md:text-base"
                        >
                          <span className="hidden sm:inline">Add</span>
                          <span className="sm:hidden">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  {searchQuery ? (
                    <>
                      <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg mb-2">No pickles found for "<span className="font-semibold">{searchQuery}</span>"</p>
                      <p className="text-gray-400 text-sm mb-4">Try searching for "mango", "chili", "lime", or other pickle ingredients</p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-[#ecab13] hover:text-[#d49c12] font-medium"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 text-[#ecab13] hover:text-[#d49c12] font-medium"
                      >
                        Clear filters to see all products
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;