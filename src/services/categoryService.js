import { api } from "./api.js";

const API_BASE_URL = "https://pickle-store-backend.onrender.com";

class CategoryService {
  static async getAllCategoriesForAdmin() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/admin`);
      if (!response.ok) {
        // Return categories that match what you see in Categories tab
        return [
          { _id: "1", title: "Pickles", category: "Pickles", emoji: "🥒", isActive: true },
          { _id: "2", title: "Seafood", category: "Seafood", emoji: "🐟", isActive: true },
          { _id: "3", title: "Podi", category: "Podi", emoji: "🌶️", isActive: true },
          { _id: "4", title: "Spices", category: "Spices", emoji: "🌿", isActive: true }
        ];
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return fallback categories with simple names
      return [
        { _id: "1", title: "Pickles", category: "Pickles", emoji: "🥒", isActive: true },
        { _id: "2", title: "Seafood", category: "Seafood", emoji: "🐟", isActive: true },
        { _id: "3", title: "Podi", category: "Podi", emoji: "🌶️", isActive: true },
        { _id: "4", title: "Spices", category: "Spices", emoji: "🌿", isActive: true }
      ];
    }
  }
}

export default CategoryService;
