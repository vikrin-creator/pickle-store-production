import { api } from './api.js';

const API_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com';

class UserService {
  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Get user profile
  async getProfile() {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      return await api.get('/api/auth/profile', {}, headers);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch profile'
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      return await api.put('/api/auth/profile', profileData, headers);
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      return await api.put('/api/auth/change-password', passwordData, headers);
    } catch (error) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message: error.message || 'Failed to change password'
      };
    }
  }

  // Get user addresses
  async getAddresses() {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const data = await api.get('/api/auth/addresses', {}, headers);
      
      return {
        success: true,
        addresses: data.addresses || []
      };
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch addresses',
        addresses: []
      };
    }
  }

  // Add new address
  async addAddress(addressData) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      return await api.post('/api/auth/addresses', addressData, headers);
    } catch (error) {
      console.error('Error adding address:', error);
      return {
        success: false,
        message: error.message || 'Failed to add address'
      };
    }
  }

  // Update address
  async updateAddress(addressId, addressData) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      return await api.put(`/api/auth/addresses/${addressId}`, addressData, headers);
    } catch (error) {
      console.error('Error updating address:', error);
      return {
        success: false,
        message: error.message || 'Failed to update address'
      };
    }
  }

  // Delete address
  async deleteAddress(addressId) {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      return await api.delete(`/api/auth/addresses/${addressId}`, headers);
    } catch (error) {
      console.error('Error deleting address:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete address'
      };
    }
  }
}

export default new UserService();