import { api } from './api';

class HeroImageService {
  // Get all hero images
  static async getAllHeroImages() {
    try {
      const response = await api.get('/api/hero-images');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching hero images:', error);
      throw new Error('Failed to fetch hero images');
    }
  }

  // Get active hero images only
  static async getActiveHeroImages() {
    try {
      const response = await api.get('/api/hero-images/active');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching active hero images:', error);
      throw new Error('Failed to fetch active hero images');
    }
  }

  // Create new hero image
  static async createHeroImage(heroImageData, imageFile = null) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(heroImageData).forEach(key => {
        if (heroImageData[key] !== null && heroImageData[key] !== undefined) {
          formData.append(key, heroImageData[key]);
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/api/hero-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating hero image:', error);
      throw new Error(error.response?.data?.error || 'Failed to create hero image');
    }
  }

  // Update hero image
  static async updateHeroImage(heroImageId, heroImageData, imageFile = null) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(heroImageData).forEach(key => {
        if (heroImageData[key] !== null && heroImageData[key] !== undefined) {
          formData.append(key, heroImageData[key]);
        }
      });

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put(`/api/hero-images/${heroImageId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating hero image:', error);
      throw new Error(error.response?.data?.error || 'Failed to update hero image');
    }
  }

  // Delete hero image
  static async deleteHeroImage(heroImageId) {
    try {
      const response = await api.delete(`/api/hero-images/${heroImageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hero image:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete hero image');
    }
  }

  // Toggle hero image active status
  static async toggleHeroImageStatus(heroImageId) {
    try {
      const response = await api.post(`/api/hero-images/${heroImageId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling hero image status:', error);
      throw new Error(error.response?.data?.error || 'Failed to toggle hero image status');
    }
  }
}

export default HeroImageService;