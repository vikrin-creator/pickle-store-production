import { api } from './api.js';

const API_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = this.getUserFromStorage();
  }

  // Get user data from localStorage
  getUserFromStorage() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    // Always check localStorage directly for fresh data, not instance variables
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userData');
    return !!(token && user);
  }

  // Get current user
  getCurrentUser() {
    // Always fetch fresh from localStorage
    return this.getUserFromStorage();
  }

  // Get auth token
  getToken() {
    return this.token;
  }

  // Set authentication data
  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // Clear authentication data
  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  // Register new user
  async register(userData) {
    try {
      console.log('Attempting registration with:', { ...userData, password: '[HIDDEN]' });
      
      const data = await api.post('/api/auth/register', userData);
      console.log('Registration response:', data);

      if (data.success) {
        this.setAuth(data.token, data.user);
        console.log('Registration successful');
      }

      return data;
    } catch (error) {
      console.error('Registration network error:', error);
      console.error('API_URL being used:', API_URL);
      console.error('Full URL attempted:', `${API_URL}/api/auth/register`);
      
      // Check if it's a CORS or network connectivity issue
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        return {
          success: false,
          message: 'Unable to connect to server. This could be a network or CORS issue. Please try again.'
        };
      }
      
      return {
        success: false,
        message: 'Network error occurred. The server might be temporarily unavailable. Please try again in a few moments.'
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      console.log('Attempting login for:', email);
      
      const data = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', data);

      if (data.success) {
        this.setAuth(data.token, data.user);
        console.log('Login successful');
      }

      return data;
    } catch (error) {
      console.error('Login network error:', error);
      console.error('API_URL being used:', API_URL);
      console.error('Full URL attempted:', `${API_URL}/api/auth/login`);
      
      // Check if it's a CORS or network connectivity issue
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        return {
          success: false,
          message: 'Unable to connect to server. This could be a network or CORS issue. Please try again.'
        };
      }
      
      return {
        success: false,
        message: 'Network error occurred. The server might be temporarily unavailable. Please try again in a few moments.'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.token) {
        const headers = { 'Authorization': `Bearer ${this.token}` };
        await api.post('/api/auth/logout', {}, headers);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Get user profile
  async getProfile() {
    try {
      if (!this.token) {
        throw new Error('No auth token');
      }

      const headers = { 'Authorization': `Bearer ${this.token}` };
      const data = await api.get('/api/auth/profile', {}, headers);

      if (data.success) {
        this.user = data.user;
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        message: 'Failed to fetch profile'
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      if (!this.token) {
        throw new Error('No auth token');
      }

      const headers = { 'Authorization': `Bearer ${this.token}` };
      const data = await api.put('/api/auth/profile', profileData, headers);

      if (data.success) {
        this.user = data.user;
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }

  // Make authenticated API requests
  async authenticatedRequest(url, options = {}) {
    try {
      if (!this.token) {
        throw new Error('No auth token');
      }

      const headers = {
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      };

      // Use the api service for authenticated requests
      const method = options.method || 'GET';
      const body = options.body ? JSON.parse(options.body) : undefined;

      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.get(url.replace(API_URL, ''), {}, headers);
          break;
        case 'POST':
          response = await api.post(url.replace(API_URL, ''), body, headers);
          break;
        case 'PUT':
          response = await api.put(url.replace(API_URL, ''), body, headers);
          break;
        case 'DELETE':
          response = await api.delete(url.replace(API_URL, ''), headers);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      return { ok: true, json: () => Promise.resolve(response) };
    } catch (error) {
      console.error('Authenticated request error:', error);
      
      // Check if token is expired
      if (error.message && (error.message.includes('401') || error.message.includes('403'))) {
        this.clearAuth();
        window.location.reload(); // Redirect to login
      }
      
      throw error;
    }
  }

  // Verify token validity
  async verifyToken() {
    try {
      if (!this.token) {
        return false;
      }

      const response = await this.authenticatedRequest(`${API_URL}/api/auth/profile`);
      const data = await response.json();

      if (data.success) {
        this.user = data.user;
        localStorage.setItem('userData', JSON.stringify(data.user));
        return true;
      } else {
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.clearAuth();
      return false;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;