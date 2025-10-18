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
      
      const response = await fetch(`${API_URL}/api/auth/orders`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      console.log('Orders response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Orders fetch failed:', errorData);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const orders = await response.json();
      console.log('Orders fetched successfully:', orders);
      
      // Transform the orders to match the expected format
      return orders.map(order => ({
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
      
    } catch (error) {
      console.error('Error fetching user orders:', error);
      
      // Return empty array on error instead of throwing
      return [];
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
      
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}

export default new OrderService();