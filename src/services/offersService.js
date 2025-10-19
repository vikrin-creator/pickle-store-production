import { API_URL } from './api';

class OffersService {
  constructor() {
    this.baseURL = `${API_URL}/offers`;
  }

  // Get all offers (for admin)
  async getAllOffers() {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching offers: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getAllOffers:', error);
      throw error;
    }
  }

  // Get active offers (for public display)
  async getActiveOffers() {
    try {
      const response = await fetch(`${this.baseURL}/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching active offers: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getActiveOffers:', error);
      throw error;
    }
  }

  // Get offer by ID
  async getOfferById(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching offer: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in getOfferById:', error);
      throw error;
    }
  }

  // Create new offer
  async createOffer(offerData) {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error creating offer: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in createOffer:', error);
      throw error;
    }
  }

  // Update offer
  async updateOffer(id, offerData) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error updating offer: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in updateOffer:', error);
      throw error;
    }
  }

  // Delete offer
  async deleteOffer(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error deleting offer: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in deleteOffer:', error);
      throw error;
    }
  }

  // Toggle offer status
  async toggleOfferStatus(id) {
    try {
      const response = await fetch(`${this.baseURL}/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error toggling offer status: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in toggleOfferStatus:', error);
      throw error;
    }
  }

  // Reorder offers
  async reorderOffers(offers) {
    try {
      const response = await fetch(`${this.baseURL}/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ offers }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error reordering offers: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in reorderOffers:', error);
      throw error;
    }
  }
}

export default new OffersService();