// Frontend service for homepage management
import { api } from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com/api';

class HomepageService {
  // Get all homepage sections
  static async getAllSections() {
    try {
      const data = await api.get('/api/homepage/sections');
      return data;
    } catch (error) {
      console.error('Error fetching homepage sections:', error);
      throw error;
    }
  }

  // Alias for getAllSections for consistency
  static async getHomepageSections() {
    return this.getAllSections();
  }

  // Get specific section by type
  static async getSection(sectionType) {
    try {
      const data = await api.get(`/api/homepage/sections/${sectionType}`);
      return data;
    } catch (error) {
      console.error(`Error fetching ${sectionType} section:`, error);
      throw error;
    }
  }

  // Add product to homepage section
  static async addProductToSection(sectionType, productData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('productId', productData.productId);
      if (productData.customTitle) formData.append('customTitle', productData.customTitle);
      if (productData.customDescription) formData.append('customDescription', productData.customDescription);
      if (productData.order !== undefined) formData.append('order', productData.order);
      
      // Add image file if provided
      if (productData.customImage && productData.customImage instanceof File) {
        formData.append('customImage', productData.customImage);
      }
      
      return await api.postFormData(`/api/homepage/sections/${sectionType}/products`, formData);
    } catch (error) {
      console.error('Error adding product to section:', error);
      throw error;
    }
  }

  // Update product in homepage section
  static async updateProductInSection(sectionType, productId, updateData, customImage = null) {
    try {
      const formData = new FormData();
      
      // Add text fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && updateData[key] !== null) {
          formData.append(key, updateData[key]);
        }
      });
      
      // Add image file if provided (only for updates with new image)
      if (customImage && customImage instanceof File) {
        formData.append('customImage', customImage);
      }

      return await api.putFormData(`/api/homepage/sections/${sectionType}/products/${productId}`, formData);
    } catch (error) {
      console.error('Error updating product in section:', error);
      throw error;
    }
  }

  // Remove product from homepage section
  static async removeProductFromSection(sectionType, productId) {
    try {
      return await api.delete(`/api/homepage/sections/${sectionType}/products/${productId}`);
    } catch (error) {
      console.error('Error removing product from section:', error);
      throw error;
    }
  }

  // Reorder products in section
  static async reorderProducts(sectionType, productOrders) {
    try {
      return await api.put(`/api/homepage/sections/${sectionType}/reorder`, { productOrders });
    } catch (error) {
      console.error('Error reordering products:', error);
      throw error;
    }
  }

  // Update section details (title, description)
  static async updateSection(sectionType, sectionData) {
    try {
      return await api.put(`/api/homepage/sections/${sectionType}`, sectionData);
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  }

  // Initialize default sections (for setup)
  static async initializeDefaultSections() {
    try {
      return await api.post('/api/homepage/initialize', {});
    } catch (error) {
      console.error('Error initializing sections:', error);
      throw error;
    }
  }
}

export default HomepageService;