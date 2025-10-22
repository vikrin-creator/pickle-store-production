const API_BASE_URL = "https://pickle-store-backend.onrender.com";

class OfferBannerService {
  static async getOfferBannerSettings() {
    try {
      console.log('OfferBannerService: Getting settings from API');
      const response = await fetch(`${API_BASE_URL}/api/offer-banner`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch offer banner settings: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('OfferBannerService: Loaded settings from database:', data);
      return data;
    } catch (error) {
      console.error('Error fetching offer banner settings:', error);
      // Return minimal fallback - no hardcoded values
      return {
        text: 'Welcome to our store!',
        isActive: true,
        backgroundColor: 'from-orange-500 to-orange-600',
        customStartColor: '#f97316',
        customEndColor: '#ea580c',
        useCustomColors: false,
        textColor: 'text-white',
        animationSpeed: 30
      };
    }
  }

  static async updateOfferBannerSettings(settings) {
    try {
      console.log('OfferBannerService: Updating settings via API:', settings);
      const response = await fetch(`${API_BASE_URL}/api/offer-banner`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error(`Failed to update offer banner settings: ${response.status}`);
      }

      const data = await response.json();
      console.log('OfferBannerService: Successfully updated settings');
      return data;
    } catch (error) {
      console.error('Error updating offer banner settings:', error);
      throw error;
    }
  }
}

export default OfferBannerService;