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

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;

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
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      return data;

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
      const response = await fetch(`${API_URL}/api/auth/addresses`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch addresses');
      }

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
      const response = await fetch(`${API_URL}/api/auth/addresses`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(addressData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add address');
      }

      return data;

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
      const response = await fetch(`${API_URL}/api/auth/addresses/${addressId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(addressData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update address');
      }

      return data;

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
      const response = await fetch(`${API_URL}/api/auth/addresses/${addressId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete address');
      }

      return data;

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