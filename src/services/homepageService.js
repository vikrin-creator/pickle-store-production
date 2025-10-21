// Frontend service for homepage management
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com/api';

class HomepageService {
  // Get all homepage sections
  static async getAllSections() {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage/sections`);
      if (!response.ok) {
        throw new Error('Failed to fetch homepage sections');
      }
      return await response.json();
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
      const response = await fetch(`${API_BASE_URL}/homepage/sections/${sectionType}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sectionType} section`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${sectionType} section:`, error);
      throw error;
    }
  }

  // Add product to homepage section
  static async addProductToSection(sectionType, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage/sections/${sectionType}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add product to section');
      }
      
      return await response.json();
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
      
      // Add image if provided
      if (customImage) {
        formData.append('customImage', customImage);
      }

      const response = await fetch(`${API_BASE_URL}/homepage/sections/${sectionType}/products/${productId}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product in section');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating product in section:', error);
      throw error;
    }
  }

  // Remove product from homepage section
  static async removeProductFromSection(sectionType, productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage/sections/${sectionType}/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove product from section');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing product from section:', error);
      throw error;
    }
  }

  // Reorder products in section
  static async reorderProducts(sectionType, productOrders) {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage/sections/${sectionType}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productOrders })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reorder products');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error reordering products:', error);
      throw error;
    }
  }

  // Update section details (title, description)
  static async updateSection(sectionType, sectionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage/sections/${sectionType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sectionData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update section');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  }

  // Initialize default sections (for setup)
  static async initializeDefaultSections() {
    try {
      const response = await fetch(`${API_BASE_URL}/homepage/initialize`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initialize sections');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error initializing sections:', error);
      throw error;
    }
  }
}

export default HomepageService;