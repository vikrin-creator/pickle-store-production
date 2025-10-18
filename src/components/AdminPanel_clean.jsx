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
    pendingPickup: 0,
    returnRequests: 0
  });

  // Add/Edit product form data
  const [formData, setFormData] = useState({
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

  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Load data on mount
  useEffect(() => {
    loadProducts();
    loadDashboardStats();
    loadOrders();
    loadCustomers();
    loadTransactions();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await AdminService.getAllProducts();
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const statsData = await AdminService.getDashboardStats();
      setDashboardStats(statsData);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  };

  const loadOrders = async () => {
    try {
      setOrderLoading(true);
      const ordersData = await AdminService.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setOrderLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const customersData = await AdminService.getAllCustomers();
      setCustomers(customersData);
      
      const customerStatsData = await AdminService.getCustomerStats();
      setCustomerStats(customerStatsData);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  };

  const loadTransactions = async () => {
    try {
      const transactionsData = await AdminService.getAllTransactions();
      setTransactions(transactionsData);
      
      const paymentStatsData = await AdminService.getPaymentStats();
      setPaymentStats(paymentStatsData);
      
      const shippingStatsData = await AdminService.getShippingStats();
      setShippingStats(shippingStatsData);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
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

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8 py-4 z-50 relative">
        <div className="flex justify-between items-center">
          {/* Left side - Mobile menu and Title */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
              <p className="text-xs lg:text-sm text-gray-500">Admin Dashboard</p>
            </div>
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

      {/* Middle Section - Sidebar and Content */}
      <div className="flex flex-1">
        {/* Category Section (Sidebar Navigation) */}
        <div className={`w-64 bg-gradient-to-b from-green-700 to-green-800 shadow-xl fixed h-full z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:h-auto flex flex-col`}>
          <div className="p-6 flex-1">
            <div className="flex items-center mb-8">
              <img
                src="/assets/logo.png"
                alt="Janiitra Pickles"
                className="h-10 w-10 mr-3 rounded-lg bg-white p-1"
              />
              <div>
                <h2 className="text-xl font-bold text-white">Janiitra Admin</h2>
                <p className="text-green-100 text-sm">Pickle Store</p>
              </div>
            </div>
            
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
          <div className="p-6 border-t border-white/10">
            <div className="text-center text-white/70 text-sm">
              <div className="font-semibold text-orange-400">Janiitra Pickles</div>
              <div className="text-xs mt-1">Admin Dashboard</div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-gray-50 lg:ml-0">
          {/* Tab Content will be added here */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Content</h2>
                <p className="text-gray-600 mt-2">Dashboard functionality will be added here</p>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Products Content</h2>
                <p className="text-gray-600 mt-2">Products management will be added here</p>
              </div>
              
              {/* Mobile Floating Action Button */}
              <div className="fixed bottom-6 right-6 sm:hidden">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105"
                >
                  <span className="text-2xl">+</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Orders Content</h2>
                <p className="text-gray-600 mt-2">Orders management will be added here</p>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Customers Content</h2>
                <p className="text-gray-600 mt-2">Customer management will be added here</p>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Payments Content</h2>
                <p className="text-gray-600 mt-2">Payment management will be added here</p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-8">
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-800">Shipping Content</h2>
                <p className="text-gray-600 mt-2">Shipping management will be added here</p>
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