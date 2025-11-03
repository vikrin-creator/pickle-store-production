import { api } from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://pickle-store-backend.onrender.com";

class OfferBannerService {
  static async getOfferBannerSettings() {
    try {
      console.log('OfferBannerService: Getting settings from API');
      // Use api helper with better timeout handling for cold starts
      const data = await api.get('/api/offer-banner');
      console.log('OfferBannerService: Loaded settings from database:', data);
      return data;
    } catch (error) {
      console.error('Error fetching offer banner settings:', error);
      console.warn('OfferBannerService: Backend may be cold starting, using fallback...');
      // Return loading message instead of hardcoded welcome
      return {
        text: '🔄 Loading latest offers... (Backend waking up)',
        isActive: true,
        backgroundColor: 'from-blue-500 to-blue-600',
        customStartColor: '#3b82f6',
        customEndColor: '#2563eb',
        useCustomColors: false,
        textColor: 'text-white',
        animationSpeed: 30
      };
    }
  }

  static async updateOfferBannerSettings(settings) {
    try {
      console.log('OfferBannerService: Updating settings via API:', settings);
      const data = await api.put('/api/offer-banner', settings);
      console.log('OfferBannerService: Successfully updated settings');
      return data;
    } catch (error) {
      console.error('Error updating offer banner settings:', error);
      throw error;
    }
  }
}

export default OfferBannerService;