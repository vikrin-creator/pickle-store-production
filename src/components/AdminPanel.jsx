import { useState, useEffect } from 'react';
import Footer from './Footer';

const AdminPanel = ({ onBackToHome, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 125400,
    totalOrders: 1250,
    pendingOrders: 45,
    deliveredOrders: 1185,
    lowStockProducts: 8,
    newCustomers: 67,
    returningCustomers: 183
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  
  // Product filtering state
  const [productFilter, setProductFilter] = useState('all'); // 'all', 'cod-enabled', 'cod-disabled'
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetarian',
    productType: 'Pickles',
    spiceLevel: 'Medium',
    image: '',
    codAvailable: true
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [weightOptions, setWeightOptions] = useState([
    { weight: '250g', price: 150 },
    { weight: '500g', price: 280 },
    { weight: '1kg', price: 520 }
  ]);

  // Default products for localhost development
  const defaultProducts = [
    {
      _id: '1',
      name: "Mango Tango",
      description: "Traditional mango pickle made with organic ingredients and natural oils",
      category: "Vegetarian",
      spiceLevel: "Medium",
      image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009352/pickle-store/MangoTango.png",
      weights: [
        { weight: '250g', price: 150, _id: '1a' },
        { weight: '500g', price: 280, _id: '1b' },
        { weight: '1kg', price: 520, _id: '1c' }
      ],
      inStock: true,
      featured: true,
      codAvailable: true,
      rating: 4.5,
      reviews: 123
    },
    {
      _id: '2',
      name: "Lime Zest",
      description: "Zesty lime pickle with a hint of spice",
      category: "Vegetarian",
      spiceLevel: "Mild",
      image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009347/pickle-store/Limezest.png",
      weights: [
        { weight: '250g', price: 140, _id: '2a' },
        { weight: '500g', price: 260, _id: '2b' },
        { weight: '1kg', price: 480, _id: '2c' }
      ],
      inStock: true,
      featured: false,
      codAvailable: true,
      rating: 4.3,
      reviews: 56
    },
    {
      _id: '3',
      name: "Chilli Kick",
      description: "Extra spicy chilli pickle for the ultimate kick",
      category: "Vegetarian",
      spiceLevel: "Hot",
      image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009338/pickle-store/Chillikick.png",
      weights: [
        { weight: '250g', price: 180, _id: '3a' },
        { weight: '500g', price: 340, _id: '3b' },
        { weight: '1kg', price: 650, _id: '3c' }
      ],
      inStock: true,
      featured: false,
      codAvailable: false,
      rating: 4.8,
      reviews: 145
    },
    {
      _id: '4',
      name: "Garlic Pickle",
      description: "Spicy garlic pickle perfect for adding flavor to your meals",
      category: "Vegetarian",
      spiceLevel: "Medium",
      image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009343/pickle-store/Garlic.png",
      weights: [
        { weight: '250g', price: 180, _id: '4a' },
        { weight: '500g', price: 340, _id: '4b' },
        { weight: '1kg', price: 650, _id: '4c' }
      ],
      inStock: true,
      featured: false,
      codAvailable: true,
      rating: 4.7,
      reviews: 156
    },
    {
      _id: '5',
      name: "Seafood Special",
      description: "Premium seafood pickle with authentic spices",
      category: "Seafood",
      spiceLevel: "Medium",
      image: "/assets/chicken.png",
      weights: [
        { weight: '250g', price: 200, _id: '5a' },
        { weight: '500g', price: 380, _id: '5b' }
      ],
      inStock: true,
      featured: false,
      codAvailable: false,
      rating: 4.6,
      reviews: 89
    },
    {
      _id: '6',
      name: "Curry Leaf Podi",
      description: "Traditional South Indian curry leaf powder",
      category: "Podi's",
      spiceLevel: "Medium",
      image: "/assets/MangoJar.png",
      weights: [
        { weight: '250g', price: 120, _id: '6a' },
        { weight: '500g', price: 220, _id: '6b' }
      ],
      inStock: true,
      featured: false,
      codAvailable: true,
      rating: 4.4,
      reviews: 78
    }
  ];

  useEffect(() => {
    loadProducts();
  }, [activeTab]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('AdminPanel: Loading products from API');
      
      // Check if running on localhost
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isLocalhost) {
        // Use default products for localhost development
        console.log('AdminPanel: Running on localhost, using default products');
        setTimeout(() => {
          setProducts(defaultProducts);
          setLoading(false);
        }, 500); // Simulate API delay
        return;
      }
      
      // Try to fetch from API for production
      const response = await fetch('https://pickle-store-backend.onrender.com/api/products');
      if (response.ok) {
        const data = await response.json();
        console.log('AdminPanel: Loaded products from API:', data.length);
        setProducts(data);
      } else {
        console.log('AdminPanel: API failed, using default products');
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.error('AdminPanel: Error loading products from API:', error);
      console.log('AdminPanel: Using default products as fallback');
      setProducts(defaultProducts);
    } finally {
      setLoading(false);
    }
  };

  const loadHomepageSections = async () => {
    try {
      setHomepageLoading(true);
      console.log('AdminPanel: Loading homepage sections');
      
      try {
        // Always try to fetch from API first
        const sections = await HomepageService.getAllSections();
        const sectionsMap = {};
        sections.forEach(section => {
          sectionsMap[section.sectionType] = section;
        });
        setHomepageSections(sectionsMap);
        console.log('AdminPanel: Successfully loaded homepage sections from API:', sections.length);
      } catch (apiError) {
        console.log('AdminPanel: API failed, using mock homepage data as fallback');
        // Use mock data as fallback
        setHomepageSections({
          featured: {
            title: 'Featured Pickles',
            products: [
              {
                productId: {
                  _id: '1',
                  name: 'Mango Tango',
                  description: 'Traditional mango pickle made with organic ingredients',
                  price: 150,
                  image: 'https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009352/pickle-store/MangoTango.png',
                  weights: [{ weight: '250g', price: 150 }]
                },
                customTitle: null,
                customDescription: null,
                customImage: null
              }
            ]
          },
          customerFavorites: {
            title: 'Customer Favorites',
            products: [
              {
                productId: {
                  _id: '3',
                  name: 'Chili Kick',
                  description: 'Spicy red chili pickle for heat lovers',
                  price: 140,
                  image: 'https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009338/pickle-store/Chillikick.png',
                  weights: [{ weight: '250g', price: 140 }]
                },
                customTitle: 'Spicy Special',
                customDescription: 'Our hottest and most popular pickle!',
                customImage: null
              }
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error loading homepage sections:', error);
      // Use empty sections as fallback
      setHomepageSections({
        featured: { products: [] },
        customerFavorites: { products: [] }
      });
    } finally {
      setHomepageLoading(false);
    }
  };

  // Homepage management functions
  const addProductToHomepage = async (productId, sectionType, customData = {}) => {
    try {
      await HomepageService.addProductToSection(sectionType, {
        productId,
        ...customData
      });
      
      // Reload sections
      await loadHomepageSections();
    } catch (error) {
      console.error('Error adding product to homepage:', error);
      alert('Error adding product to homepage: ' + error.message);
    }
  };

  const removeProductFromHomepage = async (productId, sectionType) => {
    try {
      await HomepageService.removeProductFromSection(sectionType, productId);
      
      // Reload sections
      await loadHomepageSections();
    } catch (error) {
      console.error('Error removing product from homepage:', error);
      alert('Error removing product from homepage: ' + error.message);
    }
  };

  const updateHomepageProduct = async (productId, sectionType, updateData, customImage = null) => {
    try {
      await HomepageService.updateProductInSection(sectionType, productId, updateData, customImage);
      
      // Reload sections
      await loadHomepageSections();
    } catch (error) {
      console.error('Error updating homepage product:', error);
      alert('Error updating homepage product: ' + error.message);
    }
  };

  const initializeHomepageWithDefaults = async () => {
    try {
      // Try to initialize via API
      await HomepageService.initializeDefaultSections();
      await loadHomepageSections();
      alert('Homepage sections initialized successfully!');
    } catch (error) {
      console.error('Error initializing homepage:', error);
      alert('Error initializing homepage: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    try {
      console.log('Form data before sending:', formData); // Debug log
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      
      // Map productType to category for backend compatibility
      let categoryToSend = formData.category; // Default to dietary category
      if (formData.productType === 'Seafood') {
        categoryToSend = 'Seafood';
      } else if (formData.productType === 'Podi') {
        categoryToSend = "Podi's";
      }
      // For Pickles and Spices, use the dietary category (Vegetarian/Non-Vegetarian)
      
      formDataToSend.append('category', categoryToSend);
      formDataToSend.append('productType', formData.productType);
      formDataToSend.append('spiceLevel', formData.spiceLevel || 'Medium');
      formDataToSend.append('weights', JSON.stringify(weightOptions));
      
      if (selectedImageFile) {
        formDataToSend.append('image', selectedImageFile);
      } else if (!editingProduct && !selectedImageFile) {
        alert('Please select an image for the product');
        return;
      }

      // Debug: Log what we're sending
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const url = editingProduct 
        ? `https://pickle-store-backend.onrender.com/api/admin/products/${editingProduct._id}`
        : 'https://pickle-store-backend.onrender.com/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      if (response.ok) {
        const savedProduct = await response.json();
        
        if (editingProduct) {
          // Update existing product in local state
          setProducts(products.map(p => 
            p._id === editingProduct._id ? savedProduct : p
          ));
        } else {
          // Add new product to local state
          setProducts([...products, savedProduct]);
        }

        // Reset form
        setFormData({
          name: '',
          description: '',
          category: 'Vegetarian',
          productType: 'Pickles',
          spiceLevel: 'Medium',
          image: ''
        });
        setWeightOptions([
          { weight: '250g', price: 150 },
          { weight: '500g', price: 280 },
          { weight: '1kg', price: 520 }
        ]);
        setSelectedImageFile(null);
        setImagePreview('');
        setShowAddForm(false);
        setEditingProduct(null);

        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to save product: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      productType: product.productType || 'Pickles', // Default to Pickles if not set
      spiceLevel: product.spiceLevel || 'Medium',
      image: product.image,
      codAvailable: product.codAvailable !== undefined ? product.codAvailable : true
    });
    // Set weight options from the product weights - strip _id fields for frontend use
    const cleanWeights = product.weights ? product.weights.map(w => ({
      weight: w.weight,
      price: w.price
    })) : [
      { weight: '250g', price: 150 },
      { weight: '500g', price: 280 },
      { weight: '1kg', price: 520 }
    ];
    setWeightOptions(cleanWeights);
    setImagePreview(product.image);
    setSelectedImageFile(null);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This will also delete its image from the database.')) {
      try {
        const response = await fetch(`https://pickle-store-backend.onrender.com/api/admin/products/${productId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Remove product from local state
          const updatedProducts = products.filter(product => product._id !== productId);
          setProducts(updatedProducts);
          alert('Product and associated image deleted successfully!');
        } else {
          const error = await response.json();
          alert(`Failed to delete product: ${error.error}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const toggleFeaturedStatus = async (productId) => {
    try {
      const product = products.find(p => (p._id || p.id) === productId);
      if (!product) return;

      const updatedFeaturedStatus = !product.featured;
      
      // For now, just update local state since we don't have backend endpoint for featured status
      const updatedProducts = products.map(p => 
        (p._id || p.id) === productId 
          ? { ...p, featured: updatedFeaturedStatus }
          : p
      );
      
      setProducts(updatedProducts);
      
      // TODO: Add API call to update featured status on backend when available
      // const response = await fetch(`https://pickle-store-backend.onrender.com/api/admin/products/${productId}/featured`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ featured: updatedFeaturedStatus })
      // });
      
      alert(`Product ${updatedFeaturedStatus ? 'added to' : 'removed from'} featured list!`);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert('Failed to update featured status. Please try again.');
    }
  };

  const toggleCustomerFavorite = async (productId) => {
    try {
      const product = products.find(p => (p._id || p.id) === productId);
      if (!product) return;

      const updatedFavoriteStatus = !product.customerFavorite;
      
      // Update local state
      const updatedProducts = products.map(p => 
        (p._id || p.id) === productId 
          ? { ...p, customerFavorite: updatedFavoriteStatus }
          : p
      );
      
      setProducts(updatedProducts);
      
      // TODO: Add API call to update customer favorite status on backend when available
      // const response = await fetch(`https://pickle-store-backend.onrender.com/api/admin/products/${productId}/customer-favorite`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ customerFavorite: updatedFavoriteStatus })
      // });
      
      alert(`Product ${updatedFavoriteStatus ? 'added to' : 'removed from'} customer favorites!`);
    } catch (error) {
      console.error('Error toggling customer favorite status:', error);
      alert('Failed to update customer favorite status. Please try again.');
    }
  };

  const toggleCODStatus = async (productId) => {
    try {
      const product = products.find(p => (p._id || p.id) === productId);
      if (!product) return;

      const updatedCODStatus = !product.codAvailable;
      
      // Update local state
      const updatedProducts = products.map(p => 
        (p._id || p.id) === productId 
          ? { ...p, codAvailable: updatedCODStatus }
          : p
      );
      
      setProducts(updatedProducts);
      
      // TODO: Add API call to update COD status on backend when available
      // const response = await fetch(`https://pickle-store-backend.onrender.com/api/admin/products/${productId}/cod-status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ codAvailable: updatedCODStatus })
      // });
      
      alert(`COD ${updatedCODStatus ? 'enabled' : 'disabled'} for this product!`);
    } catch (error) {
      console.error('Error toggling COD status:', error);
      alert('Failed to update COD status. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setSelectedImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      category: 'Vegetarian',
      productType: 'Pickles',
      spiceLevel: 'Medium',
      featured: false,
      rating: 0,
      reviews: 0,
      image: '',
      codAvailable: true
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full border-b border-[#ecab13]/20 bg-[#2d6700]/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <div className="flex items-center">
            <img 
              src="/assets/logo.png"
              alt="Janiitra Logo"
              className="h-6 w-36 sm:h-8 sm:w-48 object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-[#ecab13] text-white rounded-lg hover:bg-[#d49c12] transition-colors"
            >
              Add Product
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#221c10] mb-8">Admin Panel</h1>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-8">
              {[
                { id: 'dashboard', label: '🧂 Dashboard', icon: '📊' },
                { id: 'products', label: '🛍 Products', icon: '📦' },
                { id: 'orders', label: '📦 Orders', icon: '📋' },
                { id: 'payments', label: '💳 Payments', icon: '💰' },
                { id: 'shipping', label: '🚚 Shipping', icon: '🚛' },
                { id: 'customers', label: '👥 Customers', icon: '👤' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.icon}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-600">Total Sales</h3>
                    <p className="text-2xl font-bold text-gray-900">₹{dashboardStats.totalSales.toLocaleString()}</p>
                  </div>
                  <div className="text-green-500 text-2xl">💰</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
                  </div>
                  <div className="text-blue-500 text-2xl">📦</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-600">Pending Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</p>
                  </div>
                  <div className="text-yellow-500 text-2xl">⏳</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-600">Low Stock Alert</h3>
                    <p className="text-2xl font-bold text-gray-900">{dashboardStats.lowStockProducts}</p>
                  </div>
                  <div className="text-red-500 text-2xl">⚠️</div>
                </div>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Top Selling Pickles</h3>
              <div className="space-y-3">
                {products.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{product.weights?.[0]?.price || 150}</p>
                      <p className="text-sm text-gray-500">Sales: {Math.floor(Math.random() * 200) + 50}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Customer Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New Customers (This Month)</span>
                    <span className="font-bold text-blue-600">{dashboardStats.newCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Returning Customers</span>
                    <span className="font-bold text-green-600">{dashboardStats.returningCustomers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer Retention</span>
                    <span className="font-bold text-purple-600">73%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-2xl mb-1">➕</div>
                    <div className="text-sm font-medium">Add Product</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="text-2xl mb-1">📋</div>
                    <div className="text-sm font-medium">View Orders</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-sm font-medium">Customers</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('shipping')}
                    className="p-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <div className="text-2xl mb-1">🚚</div>
                    <div className="text-sm font-medium">Shipping</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <>
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading products...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error Loading Products</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <button
                      onClick={loadProducts}
                      className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Products State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h3a2 2 0 012 2v1M9 7h6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
              </div>
            )}

            {/* Filter Controls */}
            {!loading && !error && products.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Filter by COD:</label>
                  <select 
                    value={productFilter} 
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="all">All Products</option>
                    <option value="cod-enabled">COD Enabled</option>
                    <option value="cod-disabled">COD Disabled</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  Total: {products.filter(p => 
                    productFilter === 'all' ? true : 
                    productFilter === 'cod-enabled' ? p.codAvailable : 
                    !p.codAvailable
                  ).length} products
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.filter(product => 
            productFilter === 'all' ? true : 
            productFilter === 'cod-enabled' ? product.codAvailable : 
            !product.codAvailable
          ).map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image ? (product.image.startsWith('/api/') ? `https://pickle-store-backend.onrender.com${product.image}` : product.image) : 'https://via.placeholder.com/300x200'}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.log('AdminPanel: Image failed to load:', product.image);
                  e.target.src = 'https://via.placeholder.com/300x200';
                }}
                onLoad={() => {
                  console.log('AdminPanel: Image loaded successfully:', product.image);
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="mb-2">
                  {product.weights && product.weights.length > 0 && (
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Prices: </span>
                      {product.weights.map((w, idx) => (
                        <span key={idx} className="text-[#ecab13] font-bold">
                          {w.weight}: ₹{w.price}{idx < product.weights.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 text-xs mb-3">
                  <span className="bg-blue-100 px-2 py-1 rounded text-blue-800">{product.productType || 'Pickles'}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                  {product.featured && <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">Featured</span>}
                  {product.rating && <span className="bg-green-100 px-2 py-1 rounded text-green-800">★ {product.rating}</span>}
                  <span className={`px-2 py-1 rounded font-medium ${
                    product.codAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.codAvailable ? '💰 COD' : '❌ No COD'}
                  </span>
                </div>
                
                {/* COD Toggle */}
                <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Cash on Delivery:</span>
                  <button
                    onClick={() => toggleCODStatus(product._id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      product.codAvailable ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        product.codAvailable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
            )}

        {/* Add/Edit Product Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                
                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Type</label>
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    >
                      <option value="Pickles">Pickles</option>
                      <option value="Spices">Spices</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Podi">Podi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Dietary Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Spice Level</label>
                    <select
                      name="spiceLevel"
                      value={formData.spiceLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Hot">Hot</option>
                      <option value="Extra Hot">Extra Hot</option>
                    </select>
                  </div>

                  {/* COD Availability */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Cash on Delivery (COD)</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, codAvailable: !prev.codAvailable }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          formData.codAvailable ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.codAvailable ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-sm text-gray-600">
                        {formData.codAvailable ? 'COD Enabled' : 'COD Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enable this option to allow customers to pay cash on delivery for this product.
                    </p>
                  </div>

                  {/* Weight Options Section */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-3">Weight & Pricing Options</label>
                    <div className="space-y-3">
                      {weightOptions.map((option, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Weight (e.g., 250g)"
                              value={option.weight}
                              onChange={(e) => {
                                const newOptions = [...weightOptions];
                                newOptions[index].weight = e.target.value;
                                setWeightOptions(newOptions);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              value={option.price}
                              onChange={(e) => {
                                const newOptions = [...weightOptions];
                                newOptions[index].price = parseFloat(e.target.value) || 0;
                                setWeightOptions(newOptions);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = weightOptions.filter((_, i) => i !== index);
                              setWeightOptions(newOptions);
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setWeightOptions([...weightOptions, { weight: '', price: 0 }]);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Add Weight Option
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Upload an image file (JPG, PNG, etc.)</p>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveProduct}
                    disabled={!formData.name || !formData.description}
                    className="flex-1 px-4 py-2 bg-[#ecab13] text-white rounded-lg hover:bg-[#d49c12] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">📦 Order Management</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                  <option>All Orders</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { id: 'ORD001', customer: 'John Doe', items: 'Mango Tango x2, Lime Zest x1', amount: 580, status: 'Pending', date: '2025-10-13' },
                      { id: 'ORD002', customer: 'Sarah Smith', items: 'Chilli Kick x1, Garlic Pickle x1', amount: 520, status: 'Processing', date: '2025-10-12' },
                      { id: 'ORD003', customer: 'Mike Johnson', items: 'Seafood Special x2', amount: 760, status: 'Shipped', date: '2025-10-11' },
                      { id: 'ORD004', customer: 'Lisa Brown', items: 'Curry Leaf Podi x3', amount: 660, status: 'Delivered', date: '2025-10-10' }
                    ].map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{order.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-orange-600 hover:text-orange-900 mr-2">View</button>
                          <button className="text-blue-600 hover:text-blue-900">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">💳 Payment & Transactions</h2>
            
            {/* Payment Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                <p className="text-2xl font-bold text-green-600">₹1,25,400</p>
                <p className="text-sm text-gray-500">+12% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Online Payments</h3>
                <p className="text-2xl font-bold text-blue-600">₹89,200</p>
                <p className="text-sm text-gray-500">71% of total</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">COD Orders</h3>
                <p className="text-2xl font-bold text-orange-600">₹36,200</p>
                <p className="text-sm text-gray-500">29% of total</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Failed Payments</h3>
                <p className="text-2xl font-bold text-red-600">₹4,500</p>
                <p className="text-sm text-gray-500">3.6% failure rate</p>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: 'TXN001', customer: 'John Doe', amount: 580, method: 'UPI', status: 'Success', date: '2025-10-13 10:30' },
                      { id: 'TXN002', customer: 'Sarah Smith', amount: 520, method: 'Credit Card', status: 'Success', date: '2025-10-12 15:45' },
                      { id: 'TXN003', customer: 'Mike Johnson', amount: 760, method: 'COD', status: 'Pending', date: '2025-10-11 09:20' }
                    ].map((txn) => (
                      <tr key={txn.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{txn.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{txn.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹{txn.amount}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{txn.method}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            txn.status === 'Success' ? 'bg-green-100 text-green-800' : 
                            txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{txn.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">🚚 Delivery & Shipping Management</h2>
            
            {/* Shipping Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Orders in Transit</h3>
                <p className="text-2xl font-bold text-blue-600">23</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Delivered Today</h3>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Avg. Delivery Time</h3>
                <p className="text-2xl font-bold text-orange-600">2.3 days</p>
              </div>
            </div>

            {/* Delivery Zones */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Delivery Zones & Charges</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pincodes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Charge</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Free Delivery Above</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Local</td>
                      <td className="px-6 py-4 text-sm text-gray-500">500001-500099</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹50</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹500</td>
                      <td className="px-6 py-4 text-sm text-gray-500">1-2 days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Regional</td>
                      <td className="px-6 py-4 text-sm text-gray-500">500100-599999</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹80</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹800</td>
                      <td className="px-6 py-4 text-sm text-gray-500">2-3 days</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">National</td>
                      <td className="px-6 py-4 text-sm text-gray-500">All India</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹120</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹1200</td>
                      <td className="px-6 py-4 text-sm text-gray-500">3-5 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">👥 Customer Management</h2>
            
            {/* Customer Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Total Customers</h3>
                <p className="text-2xl font-bold text-blue-600">1,250</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">New This Month</h3>
                <p className="text-2xl font-bold text-green-600">67</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Active Customers</h3>
                <p className="text-2xl font-bold text-orange-600">892</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Avg. Order Value</h3>
                <p className="text-2xl font-bold text-purple-600">₹485</p>
              </div>
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Customers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'John Doe', email: 'john@email.com', orders: 5, spent: 2400, lastOrder: '2025-10-13', status: 'Active' },
                      { name: 'Sarah Smith', email: 'sarah@email.com', orders: 12, spent: 5800, lastOrder: '2025-10-12', status: 'VIP' },
                      { name: 'Mike Johnson', email: 'mike@email.com', orders: 3, spent: 1200, lastOrder: '2025-10-10', status: 'Active' },
                      { name: 'Lisa Brown', email: 'lisa@email.com', orders: 8, spent: 3600, lastOrder: '2025-10-09', status: 'Regular' }
                    ].map((customer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{customer.orders}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹{customer.spent.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{customer.lastOrder}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.status === 'VIP' ? 'bg-purple-100 text-purple-800' : 
                            customer.status === 'Active' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminPanel;