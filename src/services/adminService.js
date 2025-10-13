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
      // Fetch real data from multiple endpoints
      const [products, orders] = await Promise.all([
        this.getAllProducts(),
        this.getAllOrders()
      ]);

      // Calculate real stats from data
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const totalSales = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0);
      
      const lowStockProducts = products.filter(p => p.stock < 10).length;
      
      // Calculate date-based stats
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const newCustomers = orders
        .filter(o => new Date(o.createdAt) >= thisMonth)
        .map(o => o.customerEmail)
        .filter((email, index, arr) => arr.indexOf(email) === index).length;

      return {
        totalSales: Math.round(totalSales),
        totalOrders,
        pendingOrders,
        deliveredOrders,
        lowStockProducts,
        newCustomers,
        returningCustomers: totalOrders - newCustomers
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
      // Extract unique customers from orders
      const orders = await this.getAllOrders();
      const customersMap = new Map();

      orders.forEach(order => {
        const customerKey = order.customerEmail;
        if (!customersMap.has(customerKey)) {
          customersMap.set(customerKey, {
            name: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim(),
            email: order.customerEmail,
            orders: 1,
            totalSpent: order.total,
            lastOrder: order.createdAt,
            status: order.total > 2000 ? 'VIP' : order.total > 1000 ? 'Regular' : 'Active'
          });
        } else {
          const customer = customersMap.get(customerKey);
          customer.orders += 1;
          customer.totalSpent += order.total;
          if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
            customer.lastOrder = order.createdAt;
          }
        }
      });

      return Array.from(customersMap.values());
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
        id: `TXN${order.orderNumber?.slice(-3) || Math.random().toString(36).substr(2, 3)}`,
        orderId: order._id,
        customer: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim() || 'Anonymous',
        amount: order.total,
        method: order.paymentMethod === 'cod' ? 'COD' : 'Online',
        status: order.paymentStatus === 'paid' ? 'Success' : 
                order.paymentMethod === 'cod' ? 'Pending' : 'Failed',
        date: new Date(order.createdAt).toLocaleString()
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }
}

export default AdminService;