// Frontend service for shipping management
import { api } from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com';

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
      return await api.put(`/api/shipping/zones/${zoneId}`, updateData);
    } catch (error) {
      console.error('Error updating shipping zone:', error);
      throw error;
    }
  }

  // Create new shipping zone
  static async createShippingZone(zoneData) {
    try {
      return await api.post('/api/shipping/zones', zoneData);
    } catch (error) {
      console.error('Error creating shipping zone:', error);
      throw error;
    }
  }

  // Calculate shipping cost for checkout
  static async calculateShippingCost(pincode, cartTotal) {
    try {
      return await api.post('/api/shipping/calculate', { pincode, cartTotal });
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      throw error;
    }
  }

  // Initialize default shipping zones (admin only)
  static async initializeDefaultZones() {
    try {
      return await api.post('/api/shipping/initialize', {});
    } catch (error) {
      console.error('Error initializing shipping zones:', error);
      throw error;
    }
  }

  // Delete shipping zone
  static async deleteShippingZone(zoneId) {
    try {
      return await api.delete(`/api/shipping/zones/${zoneId}`);
    } catch (error) {
      console.error('Error deleting shipping zone:', error);
      throw error;
    }
  }
}

export default ShippingService;