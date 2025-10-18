import { useState, useEffect } from 'react';
import authService from '../services/authService';
import orderService from '../services/orderService';
import userService from '../services/userService';

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
        const formattedAddresses = result.addresses.map(addr => ({
          ...addr,
          id: addr._id || addr.id
        }));
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
        currentPassword: settingsForm.currentPassword,
        newPassword: settingsForm.newPassword
      });
      
      if (result.success) {
        alert('Password changed successfully!');
        setSettingsForm({
          currentPassword: '',
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

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // Refresh data when switching to orders tab
    if (tab === 'orders' && user) {
      loadOrders();
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/4 bg-gray-50 p-4 border-r">
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
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <h3 className="text-xl font-semibold mb-4">My Orders</h3>
                {orderLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">Order #{order.orderNumber}</h4>
                            <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                          {order.deliveryAddress && (
                            <p className="text-sm text-gray-600 mt-1">
                              Delivery: {order.deliveryAddress}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No orders found</p>
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
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">My Addresses</h3>
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
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add New Address
                  </button>
                </div>

                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4 relative">
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                        <div className="pr-20">
                          <h4 className="font-semibold">{address.label}</h4>
                          <p className="text-gray-700">{address.firstName} {address.lastName}</p>
                          <p className="text-gray-600">{address.phone}</p>
                          <p className="text-gray-600">
                            {address.address}, {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4 space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No addresses saved</p>
                  </div>
                )}

                {/* Add/Edit Address Form */}
                {showAddAddress && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
                        <div className="flex space-x-4">
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
              <div>
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                
                {/* Change Password Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium mb-4">Change Password</h4>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={settingsForm.currentPassword}
                        onChange={(e) => setSettingsForm({...settingsForm, currentPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
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
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;