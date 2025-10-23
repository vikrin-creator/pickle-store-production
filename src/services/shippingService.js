// Frontend service for shipping zones management
import { api } from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com/api';

class ShippingService {
  // Get all shipping zones
  static async getShippingZones() {
    try {
      const data = await api.get('/api/shipping/zones');
      return data;
    } catch (error) {
      console.error('Error fetching shipping zones:', error);
      throw error;
    }
  }

  // Get specific shipping zone
  static async getShippingZone(zoneId) {
    try {
      const data = await api.get(`/api/shipping/zones/${zoneId}`);
      return data;
    } catch (error) {
      console.error(`Error fetching shipping zone ${zoneId}:`, error);
      throw error;
    }
  }

  // Update shipping zone
  static async updateShippingZone(zoneId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipping/zones/${zoneId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to update shipping zone');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating shipping zone:', error);
      throw error;
    }
  }

  // Create new shipping zone
  static async createShippingZone(zoneData) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipping/zones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zoneData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to create shipping zone');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating shipping zone:', error);
      throw error;
    }
  }

  // Calculate shipping cost for checkout
  static async calculateShippingCost(pincode, cartTotal) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipping/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pincode, cartTotal })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to calculate shipping cost');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      throw error;
    }
  }

  // Initialize default shipping zones (admin only)
  static async initializeDefaultZones() {
    try {
      const response = await fetch(`${API_BASE_URL}/shipping/initialize`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to initialize shipping zones');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error initializing shipping zones:', error);
      throw error;
    }
  }

  // Delete shipping zone
  static async deleteShippingZone(zoneId) {
    try {
      const response = await fetch(`${API_BASE_URL}/shipping/zones/${zoneId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to delete shipping zone');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting shipping zone:', error);
      throw error;
    }
  }
}

export default ShippingService;