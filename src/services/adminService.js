// Admin Service - Real-time backend API integration
const API_BASE_URL = 'https://pickle-store-backend.onrender.com/api';

class AdminService {
  // Products API
  static async getAllProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  static async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Failed to create product');
      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(productId, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return await response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async toggleCODStatus(productId, codAvailable) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codAvailable })
      });
      if (!response.ok) throw new Error('Failed to toggle COD status');
      return await response.json();
    } catch (error) {
      console.error('Error toggling COD status:', error);
      throw error;
    }
  }

  // Orders API
  static async getAllOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update order status');
      return await response.json();
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
}

export default AdminService;