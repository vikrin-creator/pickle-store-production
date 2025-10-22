import { api } from "./api.js";

const API_BASE_URL = "https://pickle-store-backend.onrender.com";

class CategoryService {
  static async getAllCategoriesForAdmin() {
    console.log('CategoryService: getAllCategoriesForAdmin called');
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/admin`);
      if (!response.ok) {
        // Return categories that match what you see in Categories tab
        return [
          { 
            _id: "1", 
            title: "Pickles", 
            category: "Pickles", 
            emoji: "🥒", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009352/pickle-store/MangoTango.png",
            description: "Traditional homemade pickles with authentic flavors"
          },
          { 
            _id: "2", 
            title: "Seafood", 
            category: "Seafood", 
            emoji: "🐟", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760796102/pickle-store/homepage-seafood.png",
            description: "Fresh seafood products and preparations"
          },
          { 
            _id: "3", 
            title: "Podi", 
            category: "Podi", 
            emoji: "🌶️", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009354/pickle-store/Mirchi.png",
            description: "Spicy powder blends and traditional podi varieties"
          },
          { 
            _id: "4", 
            title: "Spices", 
            category: "Spices", 
            emoji: "🌿", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009343/pickle-store/Garlic.png",
            description: "Pure and aromatic spice blends"
          }
        ];
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return fallback categories with images
      return [
        { 
          _id: "1", 
          title: "Pickles", 
          category: "Pickles", 
          emoji: "🥒", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009352/pickle-store/MangoTango.png",
          description: "Traditional homemade pickles with authentic flavors"
        },
        { 
          _id: "2", 
          title: "Seafood", 
          category: "Seafood", 
          emoji: "🐟", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760796102/pickle-store/homepage-seafood.png",
          description: "Fresh seafood products and preparations"
        },
        { 
          _id: "3", 
          title: "Podi", 
          category: "Podi", 
          emoji: "🌶️", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009354/pickle-store/Mirchi.png",
          description: "Spicy powder blends and traditional podi varieties"
        },
        { 
          _id: "4", 
          title: "Spices", 
          category: "Spices", 
          emoji: "🌿", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009343/pickle-store/Garlic.png",
          description: "Pure and aromatic spice blends"
        }
      ];
    }
  }

  static async getAllCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) {
        return [
          { 
            _id: "1", 
            title: "Pickles", 
            category: "Pickles", 
            emoji: "🥒", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009352/pickle-store/MangoTango.png",
            description: "Traditional homemade pickles with authentic flavors"
          },
          { 
            _id: "2", 
            title: "Seafood", 
            category: "Seafood", 
            emoji: "🐟", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760796102/pickle-store/homepage-seafood.png",
            description: "Fresh seafood products and preparations"
          },
          { 
            _id: "3", 
            title: "Podi", 
            category: "Podi", 
            emoji: "🌶️", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009354/pickle-store/Mirchi.png",
            description: "Spicy powder blends and traditional podi varieties"
          },
          { 
            _id: "4", 
            title: "Spices", 
            category: "Spices", 
            emoji: "🌿", 
            isActive: true,
            image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009343/pickle-store/Garlic.png",
            description: "Pure and aromatic spice blends"
          }
        ];
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [
        { 
          _id: "1", 
          title: "Pickles", 
          category: "Pickles", 
          emoji: "🥒", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009352/pickle-store/MangoTango.png",
          description: "Traditional homemade pickles with authentic flavors"
        },
        { 
          _id: "2", 
          title: "Seafood", 
          category: "Seafood", 
          emoji: "🐟", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760796102/pickle-store/homepage-seafood.png",
          description: "Fresh seafood products and preparations"
        },
        { 
          _id: "3", 
          title: "Podi", 
          category: "Podi", 
          emoji: "🌶️", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009354/pickle-store/Mirchi.png",
          description: "Spicy powder blends and traditional podi varieties"
        },
        { 
          _id: "4", 
          title: "Spices", 
          category: "Spices", 
          emoji: "🌿", 
          isActive: true,
          image: "https://res.cloudinary.com/janiitra-pickles/image/upload/v1760009343/pickle-store/Garlic.png",
          description: "Pure and aromatic spice blends"
        }
      ];
    }
  }

  static async createCategory(categoryData, imageFile) {
    console.log('CategoryService: createCategory called with:', categoryData);
    try {
      const formData = new FormData();
      formData.append('title', categoryData.title);
      formData.append('description', categoryData.description);
      formData.append('category', categoryData.category);
      formData.append('emoji', categoryData.emoji);
      formData.append('order', categoryData.order || 0);
      formData.append('isActive', categoryData.isActive !== false);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  static async updateCategory(categoryId, categoryData, imageFile) {
    try {
      const formData = new FormData();
      formData.append('title', categoryData.title);
      formData.append('description', categoryData.description);
      formData.append('category', categoryData.category);
      formData.append('emoji', categoryData.emoji);
      formData.append('order', categoryData.order || 0);
      formData.append('isActive', categoryData.isActive !== false);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  static async deleteCategory(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  static async toggleCategoryStatus(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}/toggle-status`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle category status');
      }

      return await response.json();
    } catch (error) {
      console.error("Error toggling category status:", error);
      throw error;
    }
  }
}

export default CategoryService;
