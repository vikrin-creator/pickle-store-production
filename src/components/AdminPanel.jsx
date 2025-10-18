import { useState, useEffect } from 'react';
import AdminService from '../services/adminService';

const AdminPanel = ({ onBackToHome, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dashboard stats state  
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    lowStockProducts: 0,
    newCustomers: 0,
    returningCustomers: 0
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  

  
  // Customers and transactions state
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Payment statistics state
  const [paymentStats, setPaymentStats] = useState({
    totalRevenue: 0,
    onlinePayments: 0,
    codOrders: 0,
    failedPayments: 0
  });

  // Customer statistics state
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    activeCustomers: 0,
    avgOrderValue: 0
  });

  // Shipping statistics state
  const [shippingStats, setShippingStats] = useState({
    ordersInTransit: 0,
    deliveredToday: 0,
    avgDeliveryTime: '0 days'
  });
  
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

  // Load all admin data on component mount

  useEffect(() => {
    loadAllAdminData();
  }, [activeTab]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load data based on active tab
      switch (activeTab) {
        case 'dashboard':
          await Promise.all([
            loadProducts(),
            loadDashboardStats(),
            loadOrders()
          ]);
          break;
        case 'products':
          await loadProducts();
          break;
        case 'orders':
          await loadOrders();
          break;
        case 'payments':
          await loadTransactions();
          break;
        case 'customers':
          await loadCustomers();
          break;
        default:
          await loadProducts();
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await AdminService.getAllProducts();
      console.log('Loaded products from API:', data.length);
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const stats = await AdminService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setOrderLoading(true);
      const data = await AdminService.getAllOrders();
      setOrders(data || []);
      
      // Calculate shipping statistics from orders
      calculateShippingStats(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setOrderLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await AdminService.getAllCustomers();
      setCustomers(data || []);
      
      // Calculate customer statistics
      calculateCustomerStats(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    }
  };

  const calculateCustomerStats = (customerData) => {
    const totalCustomers = customerData.length;
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newThisMonth = customerData.filter(c => 
      new Date(c.lastOrder) >= thisMonth
    ).length;
    
    const activeCustomers = customerData.filter(c => 
      c.orders > 0 && c.totalSpent > 0
    ).length;
    
    const totalRevenue = customerData.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const avgOrderValue = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

    setCustomerStats({
      totalCustomers,
      newThisMonth,
      activeCustomers,
      avgOrderValue
    });
  };

  const loadTransactions = async () => {
    try {
      const data = await AdminService.getTransactions();
      setTransactions(data || []);
      
      // Calculate payment statistics from transactions/orders
      calculatePaymentStats(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
  };

  const calculatePaymentStats = (transactionData) => {
    const totalRevenue = transactionData
      .filter(t => t.status === 'Success' || (t.method === 'COD' && t.status === 'Pending'))
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const onlinePayments = transactionData
      .filter(t => t.method !== 'COD' && t.status === 'Success')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const codOrders = transactionData
      .filter(t => t.method === 'COD')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const failedPayments = transactionData
      .filter(t => t.status === 'Failed')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    setPaymentStats({
      totalRevenue,
      onlinePayments,
      codOrders,
      failedPayments
    });
  };

  const calculateShippingStats = (orderData) => {
    const ordersInTransit = orderData.filter(o => 
      o.status === 'shipped' || o.status === 'processing'
    ).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveredToday = orderData.filter(o => {
      if (o.status !== 'delivered') return false;
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;
    
    // Calculate average delivery time for delivered orders
    const deliveredOrders = orderData.filter(o => o.status === 'delivered');
    let avgDeliveryDays = 0;
    if (deliveredOrders.length > 0) {
      const totalDays = deliveredOrders.reduce((sum, order) => {
        const orderDate = new Date(order.createdAt);
        const deliveryDate = new Date(order.updatedAt); // Assume updatedAt is delivery date
        const diffTime = Math.abs(deliveryDate - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      avgDeliveryDays = Math.round(totalDays / deliveredOrders.length);
    }

    setShippingStats({
      ordersInTransit,
      deliveredToday,
      avgDeliveryTime: `${avgDeliveryDays} days`
    });
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
      
      // Validate required fields
      if (!formData.name || !formData.description) {
        alert('Please fill in all required fields');
        return;
      }
      
      if (!editingProduct && !selectedImageFile) {
        alert('Please select an image for the product');
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        productType: formData.productType,
        spiceLevel: formData.spiceLevel || 'Medium',
        weights: weightOptions,
        image: selectedImageFile,
        codAvailable: formData.codAvailable || true
      };

      let savedProduct;
      if (editingProduct) {
        savedProduct = await AdminService.updateProduct(editingProduct._id, productData);
        // Update existing product in local state
        setProducts(products.map(p => 
          p._id === editingProduct._id ? savedProduct : p
        ));
      } else {
        savedProduct = await AdminService.createProduct(productData);
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
        image: '',
        codAvailable: true
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
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message}`);
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
        await AdminService.deleteProduct(productId);
        // Remove product from local state
        const updatedProducts = products.filter(product => product._id !== productId);
        setProducts(updatedProducts);
        alert('Product and associated image deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Failed to delete product: ${error.message}`);
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
      
      // Use AdminService to update COD status
      const updatedProduct = await AdminService.toggleCODStatus(productId, updatedCODStatus);
      
      // Update local state with response from API
      const updatedProducts = products.map(p => 
        (p._id || p.id) === productId 
          ? updatedProduct
          : p
      );
      
      setProducts(updatedProducts);
      
      alert(`COD ${updatedCODStatus ? 'enabled' : 'disabled'} for this product!`);
    } catch (error) {
      console.error('Error toggling COD status:', error);
      alert(`Failed to update COD status: ${error.message}`);
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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Top Header - Fixed */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8 py-4 z-50 fixed top-0 left-0 right-0">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and Mobile menu */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img
              src="/assets/logo.png"
              alt="Janiitra - Authentic Indian Pickles Logo"
              className="h-6 w-32 sm:h-7 sm:w-40 md:h-8 md:w-48 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => window.location.href = '/'}
            />
          </div>

          {/* Right side - Actions and Navigation */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {activeTab === 'products' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="hidden sm:flex px-3 lg:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg items-center gap-2 text-sm lg:text-base"
              >
                <span>➕</span>
                <span className="hidden md:inline">Add Product</span>
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/'}
              className="px-2 lg:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 lg:gap-2 shadow-md text-sm lg:text-base"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="px-2 lg:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-1 lg:gap-2 shadow-md text-sm lg:text-base"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 17V14H9V10H16V7L21 12L16 17M14 2A2 2 0 0 1 16 4V6H14V4H5V20H14V18H16V20A2 2 0 0 1 14 22H5A2 2 0 0 1 3 20V4A2 2 0 0 1 5 2H14Z" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Middle Section with Sidebar and Content */}
      <div className="flex flex-1 pt-20">
        {/* Category Section (Sidebar Navigation) - Fixed Position */}
        <div className={`w-64 bg-gradient-to-b from-green-700 to-green-800 shadow-xl fixed top-20 bottom-0 z-40 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-6">          
          <nav className="space-y-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Products', icon: '🛍️' },
              { id: 'orders', label: 'Orders', icon: '📦' },
              { id: 'customers', label: 'Users', icon: '👥' },
              { id: 'payments', label: 'Payments', icon: '💳' },
              { id: 'shipping', label: 'Shipping', icon: '🚚' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/20 shadow-lg border-l-4 border-orange-400 transform scale-105'
                    : 'hover:bg-white/10 hover:transform hover:scale-102'
                }`}
              >
                <div className={`w-10 h-10 ${activeTab === tab.id ? 'bg-orange-400' : 'bg-white/20'} rounded-lg flex items-center justify-center mr-3 shadow-sm`}>
                  <span className="text-lg">{tab.icon}</span>
                </div>
                <span className="text-white font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
        </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-gray-50 lg:ml-64">
          {/* Tab Content */}
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Products Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-blue-100 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold">{products.length}</p>
                    <p className="text-blue-100 text-xs mt-1">
                      Increased by {Math.floor(Math.random() * 20)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">�</span>
                  </div>
                </div>
              </div>

              {/* Total Users Card */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-green-100 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold">{customerStats.totalCustomers}</p>
                    <p className="text-green-100 text-xs mt-1">
                      Increased by {Math.floor(Math.random() * 15)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">�</span>
                  </div>
                </div>
              </div>

              {/* Total Orders Card */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-purple-100 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold">{dashboardStats.totalOrders}</p>
                    <p className="text-purple-100 text-xs mt-1">
                      {dashboardStats.pendingOrders > 0 ? 'Decreased' : 'Increased'} by {Math.floor(Math.random() * 10)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <p className="text-orange-100 text-sm font-medium">Revenue</p>
                    <p className="text-3xl font-bold">₹{Math.floor(dashboardStats.totalSales/1000)}K</p>
                    <p className="text-orange-100 text-xs mt-1">
                      Increased by {Math.floor(Math.random() * 25)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Sales Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Monthly Sales</h3>
                <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">📊</span>
                    </div>
                    <p className="text-gray-600">Chart Coming Soon</p>
                    <p className="text-sm text-gray-400">Monthly sales data visualization</p>
                  </div>
                </div>
              </div>

              {/* Revenue Generated Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Revenue Generated</h3>
                <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">💰</span>
                    </div>
                    <p className="text-gray-600">Chart Coming Soon</p>
                    <p className="text-sm text-gray-400">Revenue analysis and trends</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Selling Products */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="mr-3">🏆</span>
                  Top Selling Pickles
                </h3>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product, index) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-400'
                        }`}>
                          #{index + 1}
                        </div>
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                        <div>
                          <p className="font-semibold text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{product.weights?.[0]?.price || 150}</p>
                        <p className="text-xs text-gray-400">Stock: {product.stock || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions & Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">📊 Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <div className="text-2xl mb-2">➕</div>
                      <div className="font-semibold">Add Product</div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <div className="text-2xl mb-2">📋</div>
                      <div className="font-semibold">View Orders</div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('customers')}
                      className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <div className="text-2xl mb-2">👥</div>
                      <div className="font-semibold">Customers</div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('shipping')}
                      className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <div className="text-2xl mb-2">🚚</div>
                      <div className="font-semibold">Shipping</div>
                    </button>
                  </div>
                </div>
                
                {/* Customer Statistics */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">📈 Customer Insights</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-gray-700 font-medium">New Customers (This Month)</span>
                      <span className="font-bold text-blue-600 text-lg">{dashboardStats.newCustomers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Returning Customers</span>
                      <span className="font-bold text-green-600 text-lg">{dashboardStats.returningCustomers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Customer Retention</span>
                      <span className="font-bold text-purple-600 text-lg">73%</span>
                    </div>
                  </div>
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

            {/* Mobile Floating Action Button */}
            <div className="fixed bottom-6 right-6 sm:hidden">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105"
              >
                <span className="text-2xl">+</span>
              </button>
            </div>
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
                    {orderLoading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          Loading orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : orders.map((order) => (
                      <tr key={order._id || order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderNumber || order._id || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerInfo?.name || order.customer || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {order.items?.map(item => `${item.name} x${item.quantity}`).join(', ') || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total || order.totalAmount || order.amount || 0}</td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date || 'N/A'}
                        </td>
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
                <p className="text-2xl font-bold text-green-600">₹{paymentStats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500">From {transactions.length} transactions</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Online Payments</h3>
                <p className="text-2xl font-bold text-blue-600">₹{paymentStats.onlinePayments.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  {paymentStats.totalRevenue > 0 ? 
                    Math.round((paymentStats.onlinePayments / paymentStats.totalRevenue) * 100) : 0}% of total
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">COD Orders</h3>
                <p className="text-2xl font-bold text-orange-600">₹{paymentStats.codOrders.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  {paymentStats.totalRevenue > 0 ? 
                    Math.round((paymentStats.codOrders / paymentStats.totalRevenue) * 100) : 0}% of total
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Failed Payments</h3>
                <p className="text-2xl font-bold text-red-600">₹{paymentStats.failedPayments.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  {transactions.length > 0 ? 
                    Math.round((transactions.filter(t => t.status === 'Failed').length / transactions.length) * 100) : 0}% failure rate
                </p>
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
                    {transactions.map((txn) => (
                      <tr key={txn._id || txn.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{txn._id || txn.transactionId || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{txn.customerName || txn.customer || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹{txn.amount || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{txn.paymentMethod || txn.method || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            txn.status === 'Success' ? 'bg-green-100 text-green-800' : 
                            txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : txn.date || 'N/A'}
                        </td>
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
                <p className="text-2xl font-bold text-blue-600">{shippingStats.ordersInTransit}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Delivered Today</h3>
                <p className="text-2xl font-bold text-green-600">{shippingStats.deliveredToday}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Avg. Delivery Time</h3>
                <p className="text-2xl font-bold text-orange-600">{shippingStats.avgDeliveryTime}</p>
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
                <p className="text-2xl font-bold text-blue-600">{customerStats.totalCustomers.toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">New This Month</h3>
                <p className="text-2xl font-bold text-green-600">{customerStats.newThisMonth}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Active Customers</h3>
                <p className="text-2xl font-bold text-orange-600">{customerStats.activeCustomers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-gray-600">Avg. Order Value</h3>
                <p className="text-2xl font-bold text-purple-600">₹{customerStats.avgOrderValue}</p>
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
                    {customers.map((customer, index) => (
                      <tr key={customer._id || index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name || customer.firstName + ' ' + customer.lastName || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{customer.email || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{customer.orderCount || customer.orders || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹{(customer.totalSpent || customer.spent || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            (customer.status || customer.customerType) === 'VIP' ? 'bg-purple-100 text-purple-800' : 
                            (customer.status || customer.customerType) === 'Active' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {customer.status || customer.customerType || 'Regular'}
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

        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-600">
            © 2025 Janiitra Pickles Admin Dashboard. All rights reserved.
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Made with ❤️ for authentic Indian pickles
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;