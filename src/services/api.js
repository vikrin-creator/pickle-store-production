// API Configuration
const API_BASE_URL = 'https://pickle-store-backend.onrender.com';

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
  get: async (endpoint) => {
    try {
      const response = await fetchWithTimeout(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data) => {
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data) => {
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
      const response = await fetchWithTimeout(endpoint, {
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
      const response = await fetchWithTimeout(endpoint, {
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
      const response = await fetchWithTimeout(endpoint, {
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
  patch: async (endpoint, data) => {
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
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
  }
};

export default API_BASE_URL;