// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://pickle-store-backend.onrender.com';

// Request timeout in milliseconds (45 seconds to handle cold starts)
const REQUEST_TIMEOUT = 45000;

// Create fetch with timeout to prevent Vercel timeouts
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server may be slow, please try again');
    }
    
    // Handle CORS and network errors that indicate backend is down/rate limited
    if (error.message.includes('CORS') || error.message === 'Failed to fetch') {
      throw new Error('Backend service unavailable - please try again later');
    }
    
    throw error;
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  orders: `${API_BASE_URL}/api/orders`,
  cart: `${API_BASE_URL}/api/cart`,
  admin: `${API_BASE_URL}/api/admin`,
  health: `${API_BASE_URL}/health`
};

// API Helper Functions
export const api = {
  // GET request
  get: async (endpoint, data = {}, customHeaders = {}) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
      });
      
      // Handle specific HTTP status codes
      if (response.status === 429) {
        throw new Error('Backend service is busy (rate limited). Please try again in 15-30 minutes.');
      }
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      
      // For backend unavailable errors, throw a more user-friendly message
      if (error.message.includes('Backend service unavailable')) {
        throw new Error('Backend service is temporarily unavailable. Please try again later.');
      }
      
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data, customHeaders = {}) => {
    try {
      // Validate data to prevent JSON serialization errors
      if (data === undefined || data === null) {
        throw new Error('POST data cannot be undefined or null');
      }
      
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
        body: JSON.stringify(data),
      });
      
      // Parse response body first, regardless of status
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { success: false, message: 'Invalid server response' };
      }
      
      // Handle specific HTTP status codes
      if (response.status === 429) {
        return { success: false, message: 'Server is busy. Please try again in a few minutes.' };
      }
      
      if (response.status === 401) {
        return { success: false, message: 'Authentication failed. Please log in again.' };
      }
      
      if (response.status === 500) {
        return { success: false, message: 'Server error. Please try again later.' };
      }
      
      if (!response.ok) {
        // Return the error response from backend
        return responseData || { success: false, message: `Error: ${response.status}` };
      }
      
      return responseData;
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data, customHeaders = {}) => {
    try {
      // Validate data to prevent JSON serialization errors
      if (data === undefined || data === null) {
        throw new Error('PUT data cannot be undefined or null');
      }
      
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  },

  // POST request with FormData (for file uploads)
  postFormData: async (endpoint, formData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData, // Don't set Content-Type for FormData - browser will set it with boundary
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API FormData POST Error:', error);
      throw error;
    }
  },

  // PUT request with FormData (for file uploads)
  putFormData: async (endpoint, formData) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        body: formData, // Don't set Content-Type for FormData - browser will set it with boundary
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API FormData PUT Error:', error);
      throw error;
    }
  },

  // PATCH request
  patch: async (endpoint, data, customHeaders = {}) => {
    try {
      // Validate data to prevent JSON serialization errors
      if (data === undefined || data === null) {
        throw new Error('PATCH data cannot be undefined or null');
      }
      
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API PATCH Error:', error);
      throw error;
    }
  },

  // File upload (FormData)
  upload: async (endpoint, formData, customHeaders = {}) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          // Don't set Content-Type for FormData - browser will set it with boundary
          ...customHeaders,
        },
        body: formData,
      });
      
      // Handle specific HTTP status codes
      if (response.status === 429) {
        throw new Error('Server is busy (rate limited). Please try again in a few minutes.');
      }
      
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Upload Error:', error);
      throw error;
    }
  }
};

export default API_BASE_URL;