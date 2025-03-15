import apiClient from "./apiClient";

/**
 * Service for handling restaurant-related API requests
 */
class RestaurantService {
  /**
   * Search restaurants with filters
   * @param {Object} params - Search parameters
   * @param {string} [params.name] - Restaurant name to search for
   * @param {string} [params.address] - Restaurant address to search for
   * @param {number} [params.maxTableCount] - Maximum table count
   * @param {string} [params.category] - Restaurant category/cuisine
   * @returns {Promise<Object>} - Search results
   */
  async searchRestaurants(params = {}) {
    // Filter out undefined or empty values
    const queryParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `/api/restaurants${queryParams ? `?${queryParams}` : ""}`;

    try {
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error("Error searching restaurants:", error);
      throw error;
    }
  }

  /**
   * Get restaurant by ID
   * @param {number|string} restaurantId - Restaurant ID
   * @returns {Promise<Object>} - Restaurant data
   */
  async getRestaurantById(restaurantId) {
    if (!restaurantId) {
      throw new Error("Restaurant ID is required");
    }

    try {
      const response = await apiClient.get(`/api/restaurants/${restaurantId}`);
      return response;
    } catch (error) {
      console.error(`Error getting restaurant with ID ${restaurantId}:`, error);
      throw error;
    }
  }

  /**
   * Add a new restaurant
   * @param {Object} restaurantData - Restaurant data
   * @param {string} restaurantData.name - Restaurant name
   * @param {string} restaurantData.address - Restaurant address
   * @param {number} restaurantData.maxTableCount - Maximum table count
   * @param {string} restaurantData.category - Restaurant category/cuisine
   * @returns {Promise<Object>} - Created restaurant data
   */
  async addRestaurant(restaurantData) {
    try {
      const response = await apiClient.post("/api/restaurants", restaurantData);
      return response;
    } catch (error) {
      console.error("Error adding restaurant:", error);
      throw error;
    }
  }
}

// Export a singleton instance
const restaurantService = new RestaurantService();
export default restaurantService;
