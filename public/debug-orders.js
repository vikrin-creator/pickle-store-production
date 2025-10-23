// Debug script to test order loading
const testOrderLoading = async () => {
  try {
    // Get token from localStorage (same as the app does)
    const token = localStorage.getItem('authToken');
    console.log('Token found:', !!token);
    
    if (!token) {
      console.log('No auth token found in localStorage');
      return;
    }
    
    // Make the same API call as the app
    const response = await fetch('https://pickle-store-backend.onrender.com/api/auth/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.success) {
      console.log('Orders found:', data.orders.length);
      data.orders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
          date: order.createdAt
        });
      });
    } else {
      console.log('API call failed:', data.message);
    }
    
  } catch (error) {
    console.error('Error testing order loading:', error);
  }
};

// Run the test
testOrderLoading();