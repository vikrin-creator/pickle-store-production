import { api } from './api.js';

const API_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com';

class OrderService {
  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Get orders for authenticated user
  async getUserOrders() {
    try {
      console.log('Fetching orders for authenticated user');
      console.log('API URL:', `${API_URL}/api/auth/orders`);
      
      // Use auth headers for authenticated endpoints
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const data = await api.get('/api/auth/orders', {}, headers);
      console.log('Orders API response:', data);
      
      // Handle the backend response structure
      if (data.success) {
        const orders = data.orders || [];
        
        // Transform the orders to match the expected format
        const transformedOrders = orders.map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          status: order.status || 'ongoing',
          items: order.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            weight: item.weight
          })),
          total: order.total,
          deliveryAddress: this.formatDeliveryAddress(order.customerInfo),
          customerInfo: order.customerInfo
        }));

        return {
          success: true,
          orders: transformedOrders
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch orders',
          orders: []
        };
      }
      
    } catch (error) {
      console.error('Error fetching user orders:', error);
      
      return {
        success: false,
        message: error.message || 'Failed to fetch orders',
        orders: []
      };
    }
  }

  // Format delivery address from customer info
  formatDeliveryAddress(customerInfo) {
    if (!customerInfo) return 'Address not available';
    
    const address = customerInfo.address;
    if (typeof address === 'string') {
      return address;
    }
    
    if (typeof address === 'object' && address !== null) {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.zipCode || address.pincode
      ].filter(Boolean);
      
      return parts.length > 0 ? parts.join(', ') : 'Address not available';
    }
    
    return 'Address not available';
  }

  // Create a new order
  async createOrder(orderData) {
    try {
      console.log('Creating order:', orderData);
      
      return await api.post('/api/orders', orderData);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      return await api.get(`/api/orders/${orderId}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}

export default new OrderService();