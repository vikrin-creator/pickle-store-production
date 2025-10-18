import { useState, useEffect } from 'react';
import authService from '../services/authService';

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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    loadUserData();
    loadOrders();
    loadAddresses();
  }, []);

  const loadUserData = () => {
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
    setLoading(false);
  };

  const loadOrders = async () => {
    setOrderLoading(true);
    try {
      // Mock orders data - replace with actual API call
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          date: '2025-10-15',
          status: 'delivered',
          items: [
            { name: 'Mango Tango', quantity: 2, price: 12.99 },
            { name: 'Lime Zest', quantity: 1, price: 10.99 }
          ],
          total: 36.97,
          deliveryAddress: '123 Main St, City, State 12345'
        },
        {
          id: '2',
          orderNumber: 'ORD-2025-002',
          date: '2025-10-18',
          status: 'ongoing',
          items: [
            { name: 'Chili Kick', quantity: 1, price: 15.99 }
          ],
          total: 15.99,
          deliveryAddress: '456 Oak Ave, City, State 12345'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
    setOrderLoading(false);
  };

  const loadAddresses = () => {
    // Mock addresses data - replace with actual API call
    const mockAddresses = [
      {
        id: '1',
        label: 'Home',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        isDefault: true
      },
      {
        id: '2',
        label: 'Office',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        address: '456 Business Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400002',
        isDefault: false
      }
    ];
    setAddresses(mockAddresses);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      // API call to update profile - replace with actual implementation
      console.log('Updating profile:', profileForm);
      alert('Profile updated successfully!');
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
      // API call to change password - replace with actual implementation
      console.log('Changing password');
      alert('Password changed successfully!');
      setSettingsForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const newAddress = {
        id: Date.now().toString(),
        ...addressForm
      };
      setAddresses([...addresses, newAddress]);
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
      const updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress ? { ...addressForm } : addr
      );
      setAddresses(updatedAddresses);
      setEditingAddress(null);
      setShowAddAddress(false);
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
      alert('Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error updating address. Please try again.');
    }
  };

  const handleDeleteAddress = (addressId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      alert('Address deleted successfully!');
    }
  };

  const handleLogout = () => {
    authService.logout();
    onNavigateHome();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d6700] mx-auto"></div>
          <p className="mt-4 text-[#221c10]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'addresses', label: 'My Addresses', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="bg-[#2d6700] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose || onNavigateHome}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">My Account</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm">
                Welcome, {user?.firstName || 'Customer'}!
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors duration-200"
              >
                <svg fill="currentColor" height="16px" viewBox="0 0 256 256" width="16px" xmlns="http://www.w3.org/2000/svg">
                  <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L188.69,112H112a8,8,0,0,0,0,16h76.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path>
                </svg>
                <span className="hidden sm:block text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-md p-6">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#2d6700] text-white shadow-md'
                        : 'text-[#221c10] hover:bg-[#ecab13]/10'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-[#2d6700]">Personal Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#221c10] mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#221c10] mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#221c10] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#221c10] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-[#2d6700] text-white px-6 py-2 rounded-lg hover:bg-[#1e4a00] transition-colors duration-200"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-[#2d6700]">My Orders</h2>
                  {orderLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d6700] mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No orders found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-[#221c10]">Order #{order.orderNumber}</h3>
                              <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'ongoing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} (×{item.quantity})</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              <p>Delivery to: {order.deliveryAddress}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">Total: ₹{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#2d6700]">My Addresses</h2>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="bg-[#2d6700] text-white px-4 py-2 rounded-lg hover:bg-[#1e4a00] transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Address
                    </button>
                  </div>

                  {showAddAddress && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4">
                        {editingAddress ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-[#221c10] mb-1">
                              Label (Home, Office, etc.)
                            </label>
                            <input
                              type="text"
                              value={addressForm.label}
                              onChange={(e) => setAddressForm({...addressForm, label: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#221c10] mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#221c10] mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={addressForm.firstName}
                              onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#221c10] mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={addressForm.lastName}
                              onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-[#221c10] mb-1">
                            Full Address
                          </label>
                          <textarea
                            value={addressForm.address}
                            onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                            rows="3"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-[#221c10] mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#221c10] mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#221c10] mb-1">
                              Pincode
                            </label>
                            <input
                              type="text"
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                            className="mr-2"
                          />
                          <label htmlFor="isDefault" className="text-sm text-[#221c10]">
                            Set as default address
                          </label>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="bg-[#2d6700] text-white px-4 py-2 rounded-lg hover:bg-[#1e4a00] transition-colors duration-200"
                          >
                            {editingAddress ? 'Update Address' : 'Add Address'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddAddress(false);
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
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-4">
                    {addresses.map(address => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-[#221c10]">{address.label}</h3>
                              {address.isDefault && (
                                <span className="bg-[#ecab13] text-white text-xs px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            <p className="text-sm text-gray-600">
                              {address.address}, {address.city}, {address.state} - {address.pincode}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="text-[#2d6700] hover:text-[#1e4a00] p-1"
                              title="Edit Address"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete Address"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-[#2d6700]">Account Settings</h2>
                  
                  <div className="space-y-8">
                    {/* Change Password Section */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-[#221c10]">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#221c10] mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={settingsForm.currentPassword}
                            onChange={(e) => setSettingsForm({...settingsForm, currentPassword: e.target.value})}
                            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#221c10] mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={settingsForm.newPassword}
                            onChange={(e) => setSettingsForm({...settingsForm, newPassword: e.target.value})}
                            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                            required
                            minLength="6"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#221c10] mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={settingsForm.confirmPassword}
                            onChange={(e) => setSettingsForm({...settingsForm, confirmPassword: e.target.value})}
                            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2d6700] focus:border-transparent"
                            required
                            minLength="6"
                          />
                        </div>
                        
                        <button
                          type="submit"
                          className="bg-[#2d6700] text-white px-6 py-2 rounded-lg hover:bg-[#1e4a00] transition-colors duration-200"
                        >
                          Change Password
                        </button>
                      </form>
                    </div>

                    {/* Account Actions */}
                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-lg font-semibold mb-4 text-[#221c10]">Account Actions</h3>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg fill="currentColor" height="16px" viewBox="0 0 256 256" width="16px" xmlns="http://www.w3.org/2000/svg">
                          <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L188.69,112H112a8,8,0,0,0,0,16h76.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path>
                        </svg>
                        Logout from Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;