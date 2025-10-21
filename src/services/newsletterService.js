const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com/api';

class NewsletterService {
  // Subscribe to newsletter using backend API (with SendGrid)
  async subscribe(email) {
    try {
      if (!this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Subscribing email:', email);
      
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      console.log('Newsletter subscription successful:', data);
      return data;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get newsletter stats (admin only)
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch stats');
      }

      return data;
    } catch (error) {
      console.error('Newsletter stats error:', error);
      throw error;
    }
  }

  // Test email service connection
  async testEmailService() {
    try {
      const response = await fetch(`${API_BASE_URL}/newsletter/test-email`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Email service test error:', error);
      throw error;
    }
  }
}

export default new NewsletterService();