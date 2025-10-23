import { useState, useEffect } from 'react';
import authService from '../services/authService';
import orderService from '../services/orderService';
import userService from '../services/userService';
import { api } from '../services/api';

const CustomerProfile = ({ onNavigateHome, onClose }) => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  
  // Address state
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  
  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'confirmed', 'delivered', 'pending'

  useEffect(() => {
    const initializeData = async () => {
      await loadUserData();
      await loadAddresses();
    };
    initializeData();
  }, []);

  // Load orders when user data is available
  useEffect(() => {
    if (user && user.email) {
      loadOrders();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // First try to get fresh user data from backend
      const result = await userService.getProfile();
      if (result.success) {
        const userData = result.user;
        setUser(userData);
        setProfileForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });
        // Update auth service with fresh data
        authService.setAuth(authService.getToken(), userData);
      } else {
        // Fallback to locally stored user data
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setProfileForm({
            firstName: currentUser.firstName || '',
            lastName: currentUser.lastName || '',
            email: currentUser.email || '',
            phone: currentUser.phone || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to locally stored user data
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setProfileForm({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || ''
        });
      }
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setOrderLoading(true);
    try {
      console.log('Loading orders for authenticated user email:', user?.email);
      
      const result = await orderService.getUserOrders();
      console.log('Orders API result:', result);
      
      if (result.success) {
        console.log('Orders found:', result.orders.length);
        setOrders(result.orders || []);
      } else {
        console.error('Failed to load orders:', result.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
    setOrderLoading(false);
  };

  const loadAddresses = async () => {
    try {
      console.log('Loading addresses for authenticated user');
      const result = await userService.getAddresses();
      console.log('Addresses API result:', result);
      
      if (result.success) {
        let formattedAddresses = result.addresses.map(addr => ({
          ...addr,
          id: addr._id || addr.id
        }));
        
        // If no addresses found, automatically try to import from orders
        if (formattedAddresses.length === 0) {
          console.log('No addresses found, attempting to import from orders...');
          const migrationResult = await autoMigrateAddresses();
          if (migrationResult.success && migrationResult.addressesAdded > 0) {
            // Reload addresses after migration
            const updatedResult = await userService.getAddresses();
            if (updatedResult.success) {
              formattedAddresses = updatedResult.addresses.map(addr => ({
                ...addr,
                id: addr._id || addr.id
              }));
              console.log('Successfully imported', migrationResult.addressesAdded, 'addresses from orders');
            }
          }
        }
        
        setAddresses(formattedAddresses);
      } else {
        console.error('Failed to load addresses:', result.message);
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating profile:', profileForm);
      const result = await userService.updateProfile(profileForm);
      
      if (result.success) {
        const updatedUser = result.user;
        setUser(updatedUser);
        authService.setAuth(authService.getToken(), updatedUser);
        alert('Profile updated successfully!');
      } else {
        alert(result.message || 'Error updating profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    try {
      console.log('Changing password');
      const result = await userService.changePassword({
        newPassword: settingsForm.newPassword
      });
      
      if (result.success) {
        alert('Password changed successfully!');
        setSettingsForm({
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert(result.message || 'Error changing password. Please try again.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding address:', addressForm);
      const result = await userService.addAddress(addressForm);
      
      if (result.success) {
        const formattedAddresses = result.addresses.map(addr => ({
          ...addr,
          id: addr._id || addr.id
        }));
        setAddresses(formattedAddresses);
        
        // Reset form
        setAddressForm({
          label: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false
        });
        setShowAddAddress(false);
        alert('Address added successfully!');
      } else {
        alert(result.message || 'Error adding address. Please try again.');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Error adding address. Please try again.');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address.id);
    setAddressForm(address);
    setShowAddAddress(true);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating address:', editingAddress, addressForm);
      const result = await userService.updateAddress(editingAddress, addressForm);
      
      if (result.success) {
        const formattedAddresses = result.addresses.map(addr => ({
          ...addr,
          id: addr._id || addr.id
        }));
        setAddresses(formattedAddresses);
        
        // Reset form
        setAddressForm({
          label: '',
          firstName: '',
          lastName: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          isDefault: false
        });
        setEditingAddress(null);
        setShowAddAddress(false);
        alert('Address updated successfully!');
      } else {
        alert(result.message || 'Error updating address. Please try again.');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error updating address. Please try again.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        console.log('Deleting address:', addressId);
        const result = await userService.deleteAddress(addressId);
        
        if (result.success) {
          const formattedAddresses = result.addresses.map(addr => ({
            ...addr,
            id: addr._id || addr.id
          }));
          setAddresses(formattedAddresses);
          alert('Address deleted successfully!');
        } else {
          alert(result.message || 'Error deleting address. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Error deleting address. Please try again.');
      }
    }
  };

  const autoMigrateAddresses = async () => {
    try {
      console.log('Auto-migrating addresses from orders...');
      const result = await api.post('/api/auth/migrate-addresses', {}, {
        'Authorization': `Bearer ${authService.getToken()}`
      });
      console.log('Migration result:', result);
      
      return result;
    } catch (error) {
      console.error('Error auto-migrating addresses:', error);
      return { success: false, addressesAdded: 0 };
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      authService.logout();
      onClose(); // Close the profile modal
      // Refresh the page to update authentication state
      window.location.reload();
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // Refresh data when switching to specific tabs
    if (tab === 'orders' && user) {
      loadOrders();
    } else if (tab === 'addresses') {
      // Reload addresses when switching to addresses tab (includes auto-migration)
      loadAddresses();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price || 0).toFixed(2)}`;
  };

  const getFilteredOrders = () => {
    if (orderFilter === 'all') return orders;
    return orders.filter(order => {
      const status = order.status.toLowerCase();
      if (orderFilter === 'delivered') {
        return status === 'delivered';
      } else if (orderFilter === 'confirmed') {
        return status === 'confirmed' || status === 'processing' || status === 'pending';
      } else if (orderFilter === 'shipped') {
        return status === 'shipped';
      }
      return status === orderFilter;
    });
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing', 
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-full sm:h-5/6 mx-auto flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Mobile Tab Navigation - Always visible on screens smaller than 640px */}
        <div className="sm:hidden border-b bg-gray-50 flex-shrink-0">
          <div className="flex overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'orders', label: 'Orders', icon: '📦' },
              { id: 'addresses', label: 'Address', icon: '📍' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap min-w-max border-r border-gray-200 last:border-r-0 ${
                  activeTab === tab.id 
                    ? 'text-green-600 border-b-2 border-green-600 bg-white font-semibold' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap text-red-600 hover:text-red-700 hover:bg-red-50 min-w-max"
            >
              <span className="mr-2">🚪</span>
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden sm:block w-1/4 bg-gray-50 p-4 border-r">
            <div className="space-y-2">
              {[
                { id: 'profile', label: 'Profile Info', icon: '👤' },
                { id: 'orders', label: 'My Orders', icon: '📦' },
                { id: 'addresses', label: 'Addresses', icon: '📍' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
              
              {/* Logout Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full text-left p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                >
                  <span className="mr-2">🚪</span>
                  Logout
                </button>
                </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-6 min-h-full">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      placeholder="Enter your email"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold">My Orders</h3>
                
                {/* Order Status Filter Tabs */}
                <div>
                  <div className="flex flex-wrap gap-1 sm:flex-nowrap sm:space-x-1 bg-gray-100 p-1 rounded-lg">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'confirmed', label: 'Active' },
                      { key: 'delivered', label: 'Delivered' },
                      { key: 'shipped', label: 'Shipped' }
                    ].map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setOrderFilter(filter.key)}
                        className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                          orderFilter === filter.key
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {orderLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </div>
                ) : getFilteredOrders().length > 0 ? (
                  <div className="space-y-4">
                    {getFilteredOrders().map((order) => (
                      <div key={order.id} className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm sm:text-base">Order #{order.orderNumber}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{formatDate(order.date)}</p>
                          </div>
                          <span className={`self-start px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'confirmed' ? 'bg-orange-100 text-orange-800' :
                            order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {getOrderStatusText(order.status)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-xs sm:text-sm">
                              <span className="flex-1 pr-2">{item.name} x{item.quantity}</span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <div className="flex justify-between font-semibold text-sm sm:text-base">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                          {order.deliveryAddress && (
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                              Delivery: {order.deliveryAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      {orderFilter === 'all' ? 'No orders found' : `No ${orderFilter} orders found`}
                    </p>
                    <button
                      onClick={onNavigateHome}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold">My Addresses</h3>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        label: '',
                        firstName: '',
                        lastName: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        pincode: '',
                        isDefault: false
                      });
                      setShowAddAddress(true);
                    }}
                    className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Add New Address
                  </button>
                </div>

                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-3 sm:p-4 relative">
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                        <div className="pr-2 pb-8 sm:pr-20 sm:pb-0">
                          <h4 className="font-semibold text-sm sm:text-base">{address.label}</h4>
                          <p className="text-gray-700 text-sm">{address.firstName} {address.lastName}</p>
                          <p className="text-gray-600 text-sm">{address.phone}</p>
                          <p className="text-gray-600 text-sm break-words">
                            {address.address}, {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        <div className="absolute bottom-2 right-2 sm:top-4 sm:right-4 sm:bottom-auto flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm bg-blue-50 px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-500 hover:text-red-700 text-xs sm:text-sm bg-red-50 px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <p className="text-sm text-gray-500">
                      Addresses from your orders will appear here automatically
                    </p>
                  </div>
                )}

                {/* Add/Edit Address Form */}
                {showAddAddress && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-60 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md my-8 max-h-screen overflow-y-auto">
                      <h4 className="text-lg font-semibold mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h4>
                      <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Label
                          </label>
                          <input
                            type="text"
                            value={addressForm.label}
                            onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Home, Office, etc."
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={addressForm.firstName}
                              onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={addressForm.lastName}
                              onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <textarea
                            value={addressForm.address}
                            onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="2"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pin Code
                          </label>
                          <input
                            type="text"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Set as default address</span>
                          </label>
                        </div>
                        <div className="flex space-x-4 pt-4">
                          <button
                            type="submit"
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            {editingAddress ? 'Update Address' : 'Add Address'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddAddress(false);
                              setEditingAddress(null);
                            }}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold">Account Settings</h3>
                
                {/* Change Password Section */}
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                  <h4 className="text-base sm:text-lg font-medium mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={settingsForm.newPassword}
                        onChange={(e) => setSettingsForm({...settingsForm, newPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        minLength="6"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={settingsForm.confirmPassword}
                        onChange={(e) => setSettingsForm({...settingsForm, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        minLength="6"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}
            
            {/* Mobile Logout Button - Show at bottom of each section on mobile */}
            <div className="block sm:hidden mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;