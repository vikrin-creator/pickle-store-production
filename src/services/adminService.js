// Admin Service - Real-time backend API integration
import { api } from './api.js';

const API_BASE_URL = 'https://pickle-store-backend.onrender.com/api';

class AdminService {
  // Products API
  static async getAllProducts() {
    try {
      const data = await api.get('/api/products');
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('productCategory', productData.productCategory);
      formData.append('spiceLevel', productData.spiceLevel || 'Medium');
      formData.append('weights', JSON.stringify(productData.weights || []));
      formData.append('featured', productData.featured || false);
      formData.append('rating', productData.rating || 0);
      formData.append('reviews', productData.reviews || 0);
      
      // Add image file if provided
      if (productData.image) {
        formData.append('image', productData.image);
      }
      
      return await api.postFormData('/api/admin/products', formData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(productId, productData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('category', productData.category);
      formData.append('productCategory', productData.productCategory);
      formData.append('spiceLevel', productData.spiceLevel || 'Medium');
      formData.append('weights', JSON.stringify(productData.weights || []));
      formData.append('featured', productData.featured || false);
      formData.append('rating', productData.rating || 0);
      formData.append('reviews', productData.reviews || 0);
      
      // Add image file if provided (only for updates with new image)
      if (productData.image && productData.image instanceof File) {
        formData.append('image', productData.image);
      }
      
      return await api.putFormData(`/api/admin/products/${productId}`, formData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      return await api.delete(`/api/admin/products/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async toggleCODStatus(productId, codAvailable) {
    try {
      return await api.put(`/api/admin/products/${productId}`, { codAvailable });
    } catch (error) {
      console.error('Error toggling COD status:', error);
      throw error;
    }
  }

  // Orders API
  static async getAllOrders() {
    try {
      return await api.get('/api/orders');
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      return await api.patch(`/api/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Dashboard Stats API
  static async getDashboardStats() {
    try {
      // Fetch comprehensive stats from backend
      const response = await fetch(`${API_BASE_URL}/admin/stats`);
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      const stats = await response.json();
      
      // Return backend stats directly with proper mapping
      return {
        totalSales: Math.round(stats.totalRevenue || 0),
        totalOrders: stats.totalOrders || 0,
        pendingOrders: stats.pendingOrders || 0,
        deliveredOrders: stats.deliveredOrders || 0,
        lowStockProducts: stats.lowStockProducts || 0,
        newCustomers: stats.newCustomersThisMonth || 0,
        returningCustomers: stats.returningCustomers || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if API fails
      return {
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        lowStockProducts: 0,
        newCustomers: 0,
        returningCustomers: 0
      };
    }
  }

  // Customer Management API
  static async getAllCustomers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  // Transactions API
  static async getTransactions() {
    try {
      const orders = await this.getAllOrders();
      
      return orders.map(order => ({
        _id: order._id,
        transactionId: `TXN${order.orderNumber?.slice(-3) || Math.random().toString(36).substr(2, 3)}`,
        orderId: order._id,
        customerName: order.customerInfo?.name || 'Anonymous',
        customer: order.customerInfo?.name || 'Anonymous',
        amount: order.total || 0,
        method: order.paymentMethod === 'cod' ? 'COD' : 'Online',
        status: order.paymentStatus === 'paid' ? 'Success' : 
                order.paymentMethod === 'cod' ? 'Pending' : 'Failed',
        date: new Date(order.createdAt).toLocaleString(),
        createdAt: order.createdAt
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  // Reviews API
  static async getAllReviews() {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/admin/all`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  static async createReview(reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) throw new Error('Failed to create review');
      return await response.json();
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  static async updateReview(reviewId, reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) throw new Error('Failed to update review');
      return await response.json();
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  static async deleteReview(reviewId) {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete review');
      return await response.json();
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // FAQs API
  static async getAllFaqs() {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs/admin/all`);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  static async getPublicFaqs() {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`);
      if (!response.ok) throw new Error('Failed to fetch public FAQs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching public FAQs:', error);
      throw error;
    }
  }

  static async createFaq(faqData) {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData)
      });
      if (!response.ok) throw new Error('Failed to create FAQ');
      return await response.json();
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }

  static async updateFaq(faqId, faqData) {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs/${faqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faqData)
      });
      if (!response.ok) throw new Error('Failed to update FAQ');
      return await response.json();
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  static async deleteFaq(faqId) {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs/${faqId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete FAQ');
      return await response.json();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }
}

export default AdminService;