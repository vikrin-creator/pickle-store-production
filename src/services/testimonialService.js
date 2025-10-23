// Frontend service for testimonials management
import { api } from './api.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com/api';

class TestimonialService {
  // Public API - Get all active testimonials
  static async getAllTestimonials() {
    try {
      const data = await api.get('/api/testimonials');
      return data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  }

  // Public API - Get featured testimonials only
  static async getFeaturedTestimonials() {
    try {
      const data = await api.get('/api/testimonials/featured');
      return data;
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      throw error;
    }
  }

  // Public API - Get testimonials with query filters
  static async getTestimonialsWithFilter(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.featured) queryParams.append('featured', 'true');
      
      const endpoint = `/api/testimonials${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      return await api.get(endpoint);
    } catch (error) {
      console.error('Error fetching testimonials with filters:', error);
      throw error;
    }
  }

  // Public API - Get single testimonial by ID
  static async getTestimonialById(id) {
    try {
      return await api.get(`/api/testimonials/${id}`);
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      throw error;
    }
  }

  // Admin API - Get all testimonials (including inactive)
  static async getAllTestimonialsAdmin(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.rating) queryParams.append('rating', filters.rating);
      if (filters.featured !== undefined) queryParams.append('featured', filters.featured);
      if (filters.active !== undefined) queryParams.append('active', filters.active);
      
      const endpoint = `/api/testimonials/admin/all${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      return await api.get(endpoint);
    } catch (error) {
      console.error('Error fetching admin testimonials:', error);
      throw error;
    }
  }

  // Admin API - Create new testimonial
  static async createTestimonial(testimonialData) {
    try {
      return await api.post('/api/testimonials', testimonialData);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      throw error;
    }
  }

  // Admin API - Update testimonial
  static async updateTestimonial(id, testimonialData) {
    try {
      return await api.put(`/api/testimonials/${id}`, testimonialData);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      throw error;
    }
  }

  // Admin API - Delete testimonial
  static async deleteTestimonial(id) {
    try {
      return await api.delete(`/api/testimonials/${id}`);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      throw error;
    }
  }

  // Admin API - Toggle testimonial active status
  static async toggleTestimonialActive(id) {
    try {
      return await api.patch(`/api/testimonials/${id}/toggle-active`, {});
    } catch (error) {
      console.error('Error toggling testimonial status:', error);
      throw error;
    }
  }

  // Admin API - Toggle testimonial featured status
  static async toggleTestimonialFeatured(id) {
    try {
      return await api.patch(`/api/testimonials/${id}/toggle-featured`, {});
    } catch (error) {
      console.error('Error toggling testimonial featured status:', error);
      throw error;
    }
  }

  // Utility function to generate star display
  static getStarDisplay(rating) {
    return '⭐'.repeat(Math.max(0, Math.min(5, rating)));
  }

  // Utility function to truncate testimonial text
  static truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Utility function to validate testimonial data
  static validateTestimonialData(data) {
    const errors = [];
    
    if (!data.customerName?.trim()) {
      errors.push('Customer name is required');
    }
    
    if (!data.customerLocation?.trim()) {
      errors.push('Customer location is required');
    }
    
    if (!data.testimonialText?.trim()) {
      errors.push('Testimonial text is required');
    }
    
    if (!data.rating || data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) {
      errors.push('Rating must be an integer between 1 and 5');
    }
    
    if (data.customerName && data.customerName.length > 100) {
      errors.push('Customer name must be less than 100 characters');
    }
    
    if (data.customerLocation && data.customerLocation.length > 100) {
      errors.push('Customer location must be less than 100 characters');
    }
    
    if (data.testimonialText && data.testimonialText.length > 500) {
      errors.push('Testimonial text must be less than 500 characters');
    }
    
    if (data.productMentioned && data.productMentioned.length > 100) {
      errors.push('Product mentioned must be less than 100 characters');
    }
    
    return errors;
  }
}

export default TestimonialService;