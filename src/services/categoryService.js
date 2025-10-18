// Frontend service for category management
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class CategoryService {
  // Get all active categories (for homepage display)
  static async getAllCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get all categories for admin (includes inactive)
  static async getAllCategoriesForAdmin() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/admin`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories for admin');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories for admin:', error);
      throw error;
    }
  }

  // Get single category by ID
  static async getCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  // Create new category
  static async createCategory(categoryData, imageFile = null) {
    try {
      const formData = new FormData();
      
      // Add category data
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });
      
      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update category
  static async updateCategory(id, categoryData, imageFile = null) {
    try {
      const formData = new FormData();
      
      // Add category data
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });
      
      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Toggle category active status
  static async toggleCategoryStatus(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}/toggle-status`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to toggle category status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error toggling category status:', error);
      throw error;
    }
  }

  // Reorder categories
  static async reorderCategories(categoryOrders) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryOrders })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reorder categories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error reordering categories:', error);
      throw error;
    }
  }
}

export default CategoryService;