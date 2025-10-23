import { api } from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com/api';

class NewsletterService {
  // Subscribe to newsletter using backend API (with SendGrid)
  async subscribe(email) {
    try {
      if (!this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Subscribing email:', email);
      
      const data = await api.post('/api/newsletter/subscribe', { email });
      
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
      return await api.get('/api/newsletter/stats');
    } catch (error) {
      console.error('Newsletter stats error:', error);
      throw error;
    }
  }

  // Test email service connection
  async testEmailService() {
    try {
      return await api.get('/api/newsletter/test-email');
    } catch (error) {
      console.error('Email service test error:', error);
      throw error;
    }
  }
}

export default new NewsletterService();