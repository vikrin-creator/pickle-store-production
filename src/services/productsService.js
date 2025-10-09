import { api, API_ENDPOINTS } from './api.js';

// Products Service - replaces localStorage with API calls
export const productsService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const products = await api.get(API_ENDPOINTS.products);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to empty array if API fails
      return [];
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const product = await api.get(`${API_ENDPOINTS.products}/${id}`);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create new product (Admin)
  createProduct: async (productData) => {
    try {
      const product = await api.post(API_ENDPOINTS.products, productData);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product (Admin)
  updateProduct: async (id, productData) => {
    try {
      const product = await api.put(`${API_ENDPOINTS.products}/${id}`, productData);
      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (Admin)
  deleteProduct: async (id) => {
    try {
      const result = await api.delete(`${API_ENDPOINTS.products}/${id}`);
      return result;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Seed products (Admin)
  seedProducts: async () => {
    try {
      const result = await api.post(`${API_ENDPOINTS.admin}/seed-products`);
      return result;
    } catch (error) {
      console.error('Error seeding products:', error);
      throw error;
    }
  }
};

export default productsService;