// Admin Service - Real-time backend API integration
import { api } from './api.js';

const API_BASE_URL = 'https://pickle-store-backend.onrender.com';

class AdminService {
  // Products API
  static async getAllProducts() {
    try {
      const data = await api.get('/api/admin/products');
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
      const stats = await api.get('/api/admin/stats');
      
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
      return await api.get('/api/admin/users');
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  // Transactions API
  static async getTransactions() {
    try {
      // Call new endpoint that returns ALL orders (pending, failed, confirmed)
      const orders = await api.get('/api/orders/admin/transactions');
      
      return orders.map(order => ({
        _id: order._id,
        transactionId: `TXN${order.orderNumber?.slice(-3) || Math.random().toString(36).substr(2, 3)}`,
        orderId: order._id,
        customerName: order.customerInfo?.name || 'Anonymous',
        customer: order.customerInfo?.name || 'Anonymous',
        amount: order.total || 0,
        method: order.paymentMethod === 'cod' ? 'COD' : 'Online',
        status: order.status === 'confirmed' ? 'Success' : 
                order.status === 'pending' ? 'Pending' : 
                order.status === 'failed' ? 'Failed' : 'Unknown',
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
      return await api.get('/api/admin/reviews');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  static async createReview(reviewData) {
    try {
      return await api.post('/api/reviews', reviewData);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  static async updateReview(reviewId, reviewData) {
    try {
      return await api.put(`/api/reviews/${reviewId}`, reviewData);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  static async deleteReview(reviewId) {
    try {
      return await api.delete(`/api/reviews/${reviewId}`);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // FAQs API
  static async getAllFaqs() {
    try {
      return await api.get('/api/faqs/admin/all');
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
  }

  static async getPublicFaqs() {
    try {
      return await api.get('/api/faqs');
    } catch (error) {
      console.error('Error fetching public FAQs:', error);
      throw error;
    }
  }

  static async createFaq(faqData) {
    try {
      return await api.post('/api/faqs', faqData);
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }

  static async updateFaq(faqId, faqData) {
    try {
      return await api.put(`/api/faqs/${faqId}`, faqData);
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  static async deleteFaq(faqId) {
    try {
      return await api.delete(`/api/faqs/${faqId}`);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }
}

export default AdminService;